import React, { useState } from "react";

const UploadProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cv: null,
    certificate: null,
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Validate function
  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email is required";
    if (!formData.cv) newErrors.cv = "CV is required";
    if (!formData.certificate) newErrors.certificate = "Certificate is required";
    if (!formData.photo) newErrors.photo = "Photo is required";
    return newErrors;
  };

  const handleChange = async (e) => {
    if (e.target.type === "file") {
      // Convert file to base64 string (if you want)
      const file = e.target.files[0];
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      });
      setFormData({ ...formData, [e.target.name]: base64 });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      localStorage.setItem("userProfile", JSON.stringify(formData));
      localStorage.setItem("isProfileComplete", "true");
      setSubmitted(true);
    }
  };

  return (
    <div>
      {/* Your JSX form here */}
    </div>
  );
};

export default UploadProfile;
