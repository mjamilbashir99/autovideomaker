"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  // Updated to use useState hook for form submission state
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [submitted, setSubmitted] = useState(false);

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address"),
  });

  // Initial form values
  const initialValues = {
    email: "",
  };

  // Form submission handler
  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setFieldError }
  ) => {
    try {
      const response = await fetch("/api/register", {
        // Updated URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
        }),
      });

      const data = await response.json();

      if (response.status == 200) {
        console.log("email is:", data);
        resetForm();
        setSubmitted(true); // Changed to true
        router.push("/login");
      } else if (response.status == 400) {
        setFieldError("this email is alreay exist");
      } else {
        setFieldError("Email not found");
      }
    } catch (error) {
      console.error("Error sending the mail", error);
      setFieldError("email", "An error occurred during sendig the mail");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-10">
      <h1 className="text-3xl font-bold text-center mb-6 font-mono text-gray-400">
        Reset Password
      </h1>

      {submitted ? (
        <div className="text-center">
          <p className="text-green-500 text-xl">Link Sent via email! ✅</p>
          <p className="text-gray-500 mt-4">
            Go to{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-400">
              Login Page
            </Link>
          </p>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Email */}
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
                  className="w-full p-2 border rounded text-black"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-500 text-white py-2 rounded ${
                  isSubmitting ? "opacity-50" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default page;
