"use client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ImFacebook2 } from "react-icons/im";
import { FaGoogle } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!result.ok) {
        if (result.error === "Email does not exist") {
          setErrors({ email: "Email does not exist" });
        } else if (result.error === "Incorrect password") {
          setErrors({ password: "Incorrect password" });
        } else {
          setErrors({ general: "Invalid credentials" });
        }
        setIsLoading(false);
        setSubmitting(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-400">
        Login Form
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            {/* General Error */}
            {errors.general && (
              <div className="text-red-500 text-sm mb-4">{errors.general}</div>
            )}

            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                Email Address
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="text-gray-700 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                Password
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                className="text-gray-700 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className={`mt-5 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded ${
                isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting || isLoading ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>

      {/* Signup Link */}
      <div className="mt-6 text-center">
        <p className="text-gray-500">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:text-blue-400">
            Signup
          </Link>
        </p>
      </div>

      {/* Social Login */}
      <div className="mt-6 text-center">
        <p className="text-gray-500 mb-4">Or signin with</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => signIn("facebook")}
            className="bg-blue-600 text-white py-2 px-4 rounded flex gap-2 items-center"
          >
            <ImFacebook2 size={15} /> Facebook
          </button>
          <button
            onClick={() => signIn("google")}
            className="bg-red-500 text-white py-2 px-4 rounded flex gap-2 items-center"
          >
            <FaGoogle size={15} /> Google
          </button>
          <button
            onClick={() => signIn("twitter")}
            className="bg-blue-400 text-white py-2 px-4 rounded flex gap-2 items-center"
          >
            <BsTwitterX size={15} /> Twitter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
