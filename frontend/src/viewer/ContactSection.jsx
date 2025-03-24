"use client"

import { useState } from "react"
import { MailIcon, PhoneIcon, MapPinIcon, UserIcon, BriefcaseIcon } from "./Icons"

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    subject: "",
    message: "",
  })

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would send this data to your backend
    console.log("Form submitted:", formData)

    // Simulate successful submission
    setFormStatus({
      submitted: true,
      error: false,
      message: "Your message has been sent successfully. We will get back to you soon!",
    })

    // Reset form
    setFormData({
      name: "",
      email: "",
      organization: "",
      subject: "",
      message: "",
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Contact Internship Providers</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-xl font-medium mb-6">Get in Touch</h3>

            {formStatus.submitted && (
              <div className={`p-4 mb-6 rounded-md ${formStatus.error ? "bg-red-900/50" : "bg-green-900/50"}`}>
                <p className={formStatus.error ? "text-red-300" : "text-green-300"}>{formStatus.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field pl-10 w-full"
                      placeholder="John Doe"
                      required
                    />
                    <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-10 w-full"
                      placeholder="john@example.com"
                      required
                    />
                    <MailIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="organization" className="block text-sm font-medium mb-1">
                  Organization / Company
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="input-field pl-10 w-full"
                    placeholder="Your company name"
                  />
                  <BriefcaseIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="input-field w-full"
                  placeholder="Your message here..."
                  required
                ></textarea>
              </div>

              <div>
                <button type="submit" className="btn-primary w-full md:w-auto">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="card">
            <h3 className="text-xl font-medium mb-6">Contact Information</h3>

            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-800 flex items-center justify-center">
                  <MailIcon className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-400">Email</h4>
                  <p className="mt-1">internships@university.edu</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-800 flex items-center justify-center">
                  <PhoneIcon className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-400">Phone</h4>
                  <p className="mt-1">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-800 flex items-center justify-center">
                  <MapPinIcon className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-400">Address</h4>
                  <p className="mt-1">
                    123 University Ave, Suite 400
                    <br />
                    College Town, ST 12345
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-400 mb-4">Office Hours</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-6">
            <h3 className="text-xl font-medium mb-4">Faculty Coordinators</h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="font-medium">JS</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Dr. John Smith</h4>
                  <p className="text-sm text-gray-400">Computer Science</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="font-medium">RP</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Dr. Rachel Patel</h4>
                  <p className="text-sm text-gray-400">Electrical Engineering</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="font-medium">MJ</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Dr. Michael Johnson</h4>
                  <p className="text-sm text-gray-400">Mechanical Engineering</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactSection

