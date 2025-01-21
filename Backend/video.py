import os
import uuid

import requests
import srt_equalizer
import assemblyai as aai

from typing import List, Tuple
from moviepy.editor import *
from termcolor import colored
from dotenv import load_dotenv
from datetime import timedelta
from moviepy.video.fx.all import crop
from moviepy.video.tools.subtitles import SubtitlesClip
from PIL import Image

load_dotenv("../.env")

ASSEMBLY_AI_API_KEY = os.getenv("ASSEMBLY_AI_API_KEY")

if not hasattr(Image, 'ANTIALIAS'):
    # For Pillow 10.0.0+
    Image.ANTIALIAS = Image.Resampling.LANCZOS


def save_video(video_url: str, directory: str = "../temp") -> str:
    """
    Saves a video from a given URL and returns the path to the video.

    Args:
        video_url (str): The URL of the video to save.
        directory (str): The path of the temporary directory to save the video to

    Returns:
        str: The path to the saved video.
    """
    video_id = uuid.uuid4()
    video_path = f"{directory}/{video_id}.mp4"
    with open(video_path, "wb") as f:
        f.write(requests.get(video_url).content)

    return video_path


def __generate_subtitles_assemblyai(audio_path: str, voice: str) -> str:
    """
    Generates subtitles from a given audio file and returns the path to the subtitles.

    Args:
        audio_path (str): The path to the audio file to generate subtitles from.

    Returns:
        str: The generated subtitles
    """

    language_mapping = {
        "br": "pt",
        "id": "en", #AssemblyAI doesn't have Indonesian 
        "jp": "ja",
        "kr": "ko",
    }

    if voice in language_mapping:
        lang_code = language_mapping[voice]
    else:
        lang_code = voice

    aai.settings.api_key = ASSEMBLY_AI_API_KEY
    config = aai.TranscriptionConfig(language_code=lang_code)
    transcriber = aai.Transcriber(config=config)
    transcript = transcriber.transcribe(audio_path)
    subtitles = transcript.export_subtitles_srt()

    return subtitles


def __generate_subtitles_locally(sentences: List[str], audio_clips: List[AudioFileClip]) -> str:
    """
    Generates subtitles from a given audio file and returns the path to the subtitles.

    Args:
        sentences (List[str]): all the sentences said out loud in the audio clips
        audio_clips (List[AudioFileClip]): all the individual audio clips which will make up the final audio track
    Returns:
        str: The generated subtitles
    """

    def convert_to_srt_time_format(total_seconds):
        # Convert total seconds to the SRT time format: HH:MM:SS,mmm
        if total_seconds == 0:
            return "0:00:00,0"
        return str(timedelta(seconds=total_seconds)).rstrip('0').replace('.', ',')

    start_time = 0
    subtitles = []

    for i, (sentence, audio_clip) in enumerate(zip(sentences, audio_clips), start=1):
        duration = audio_clip.duration
        end_time = start_time + duration

        # Format: subtitle index, start time --> end time, sentence
        subtitle_entry = f"{i}\n{convert_to_srt_time_format(start_time)} --> {convert_to_srt_time_format(end_time)}\n{sentence}\n"
        subtitles.append(subtitle_entry)

        start_time += duration  # Update start time for the next subtitle

    return "\n".join(subtitles)


def generate_subtitles(audio_path: str, sentences: List[str], audio_clips: List[AudioFileClip], voice: str) -> str:
    """
    Generates subtitles from a given audio file and returns the path to the subtitles.

    Args:
        audio_path (str): The path to the audio file to generate subtitles from.
        sentences (List[str]): all the sentences said out loud in the audio clips
        audio_clips (List[AudioFileClip]): all the individual audio clips which will make up the final audio track

    Returns:
        str: The path to the generated subtitles.
    """

    def equalize_subtitles(srt_path: str, max_chars: int = 10) -> None:
        # Equalize subtitles
        srt_equalizer.equalize_srt_file(srt_path, srt_path, max_chars)

    # Save subtitles
    subtitles_path = f"../subtitles/{uuid.uuid4()}.srt"

    if ASSEMBLY_AI_API_KEY is not None and ASSEMBLY_AI_API_KEY != "":
        print(colored("[+] Creating subtitles using AssemblyAI", "blue"))
        subtitles = __generate_subtitles_assemblyai(audio_path, voice)
    else:
        print(colored("[+] Creating subtitles locally", "blue"))
        subtitles = __generate_subtitles_locally(sentences, audio_clips)
        # print(colored("[-] Local subtitle generation has been disabled for the time being.", "red"))
        # print(colored("[-] Exiting.", "red"))
        # sys.exit(1)

    with open(subtitles_path, "w") as file:
        file.write(subtitles)

    # Equalize subtitles
    equalize_subtitles(subtitles_path)

    print(colored("[+] Subtitles generated.", "green"))

    return subtitles_path


def combine_videos(video_paths: List[str], max_duration: int, max_clip_duration: int, threads: int) -> str:
    """
    Combines a list of videos into one video and returns the path to the combined video.

    Args:
        video_paths (List): A list of paths to the videos to combine.
        max_duration (int): The maximum duration of the combined video.
        max_clip_duration (int): The maximum duration of each clip.
        threads (int): The number of threads to use for the video processing.

    Returns:
        str: The path to the combined video.
    """
    try:
        # Create temp directory if it doesn't exist
        os.makedirs("../temp", exist_ok=True)
        
        video_id = str(uuid.uuid4())
        combined_video_path = os.path.abspath(f"../temp/{video_id}.mp4")
        
        # Required duration of each clip
        req_dur = max_duration / len(video_paths)

        print(colored("[+] Combining videos...", "blue"))
        print(colored(f"[+] Each clip will be maximum {req_dur} seconds long.", "blue"))
        print(colored(f"[+] Output path: {combined_video_path}", "blue"))

        clips = []
        tot_dur = 0
        # Add downloaded clips over and over until the duration of the audio (max_duration) has been reached
        while tot_dur < max_duration:
            for video_path in video_paths:
                if not os.path.exists(video_path):
                    raise FileNotFoundError(f"Input video not found: {video_path}")
                    
                clip = VideoFileClip(video_path)
                clip = clip.without_audio()
                # Check if clip is longer than the remaining audio
                if (max_duration - tot_dur) < clip.duration:
                    clip = clip.subclip(0, (max_duration - tot_dur))
                # Only shorten clips if the calculated clip length (req_dur) is shorter than the actual clip to prevent still image
                elif req_dur < clip.duration:
                    clip = clip.subclip(0, req_dur)
                clip = clip.set_fps(30)

                # Not all videos are same size,
                # so we need to resize them
                if round((clip.w/clip.h), 4) < 0.5625:
                    clip = crop(clip, width=clip.w, height=round(clip.w/0.5625),
                              x_center=clip.w / 2,
                              y_center=clip.h / 2)
                else:
                    clip = crop(clip, width=round(0.5625*clip.h), height=clip.h,
                              x_center=clip.w / 2,
                              y_center=clip.h / 2)
                clip = clip.resize((1080, 1920))

                if clip.duration > max_clip_duration:
                    clip = clip.subclip(0, max_clip_duration)

                clips.append(clip)
                tot_dur += clip.duration

        final_clip = concatenate_videoclips(clips)
        final_clip = final_clip.set_fps(30)
        final_clip.write_videofile(combined_video_path, threads=threads)

        # Verify the file was created
        if not os.path.exists(combined_video_path):
            raise FileNotFoundError(f"Failed to create combined video at: {combined_video_path}")

        print(colored(f"[+] Combined video saved at: {combined_video_path}", "green"))
        return combined_video_path

    except Exception as e:
        print(colored(f"[-] Error in combine_videos: {str(e)}", "red"))
        # Clean up any partial clips
        for clip in clips:
            try:
                clip.close()
            except:
                pass
        raise


def generate_video(combined_video_path: str, tts_path: str, subtitles_path: str, threads: int, subtitles_position: str, text_color: str) -> Tuple[str, str]:
    """
    This function creates the final video, with subtitles and audio.

    Args:
        combined_video_path (str): The path to the combined video.
        tts_path (str): The path to the text-to-speech audio.
        subtitles_path (str): The path to the subtitles.
        threads (int): The number of threads to use for the video processing.
        subtitles_position (str): The position of the subtitles.
        text_color (str): The color of the subtitles.

    Returns:
        Tuple[str, str]: The filename of the final video and the video_id
    """
    try:
        # Make a generator that returns a TextClip when called with consecutive
        generator = lambda txt: TextClip(
            txt,
            font="../fonts/bold_font.ttf",
            fontsize=100,
            color=text_color,
            stroke_color="black",
            stroke_width=5,
        )

        # Split the subtitles position into horizontal and vertical
        horizontal_subtitles_position, vertical_subtitles_position = subtitles_position.split(",")

        # Load the video and audio clips
        video_clip = VideoFileClip(combined_video_path)
        audio_clip = AudioFileClip(tts_path)

        # Ensure audio duration matches video duration
        if audio_clip.duration > video_clip.duration:
            video_clip = video_clip.loop(duration=audio_clip.duration)
        elif video_clip.duration > audio_clip.duration:
            video_clip = video_clip.subclip(0, audio_clip.duration)

        # Burn the subtitles into the video
        subtitles = SubtitlesClip(subtitles_path, generator)
        result = CompositeVideoClip([
            video_clip,
            subtitles.set_pos((horizontal_subtitles_position, vertical_subtitles_position))
        ])

        # Set the audio
        result = result.set_audio(audio_clip)

        # Generate UUID for final video name
        final_video_id = str(uuid.uuid4())
        final_video_dir = "../final_videos"
        os.makedirs(final_video_dir, exist_ok=True)
        output_path = os.path.join(final_video_dir, f"{final_video_id}.mp4")

        # Write the final video with audio codec specified
        result.write_videofile(
            output_path,
            threads=threads or 2,
            codec='libx264',
            audio_codec='aac',
            fps=30
        )

        # Close the clips to free up resources
        video_clip.close()
        audio_clip.close()
        result.close()

        return f"{final_video_id}.mp4", final_video_id  # Return both filename and ID

    except Exception as e:
        print(colored(f"[-] Error in generate_video: {str(e)}", "red"))
        raise


def save_video_metadata(video_id: str, title: str, description: str, tags: List[str]) -> None:
    """
    Saves video metadata to a text file alongside the video.
    
    Args:
        video_id (str): The UUID of the video (without .mp4 extension)
        title (str): The video title
        description (str): The video description
        tags (List[str]): List of tags for the video
    """
    try:
        metadata_dir = "../final_videos"
        os.makedirs(metadata_dir, exist_ok=True)
        
        # Format tags as comma-separated string without hashtags
        tags_string = ", ".join(tag.strip('#') for tag in tags)
        
        metadata_content = f"""Title: {title}

Description:
{description}

Tags:
{tags_string}"""

        # Save metadata with same UUID as video
        metadata_path = os.path.join(metadata_dir, f"{video_id}.txt")
        with open(metadata_path, "w", encoding='utf-8') as f:
            f.write(metadata_content)
            
        print(colored(f"[+] Metadata saved at: {metadata_path}", "green"))
        
    except Exception as e:
        print(colored(f"[-] Error saving metadata: {str(e)}", "red"))
        raise
