// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaLock, FaFilePdf, FaImage } from 'react-icons/fa';

// const RegisterWithProfileUpload = () => {
//   const initialFormState = {
//     fullName: '',
//     email: '',
//     phoneNumber: '',
//     password: '',
//     confirmPassword: '',
//     cv: null,
//     certificates: null,
//     photo: null,
//   };

//   const [formData, setFormData] = useState(initialFormState);
//   const [errors, setErrors] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     if (e.target.type === 'file') {
//       setFormData({ ...formData, [e.target.name]: e.target.files[0] });
//       setErrors(prev => ({ ...prev, [e.target.name]: null }));
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//       if (errors[e.target.name]) {
//         setErrors(prev => ({ ...prev, [e.target.name]: null }));
//       }
//     }
//     if (apiError) setApiError(null);
//   };

//   const validatePhoneNumber = (phone) => {
//     if (!phone.startsWith('+')) return 'Phone number must start with +';
    
//     const numberPart = phone.substring(1);
//     if (!/^\d+$/.test(numberPart)) return 'Phone number must contain only digits after +';
    
//     if (phone.startsWith('+255') && phone.length !== 13) {
//       return 'Tanzania phone number must be 12 digits after + (e.g., +255123456789)';
//     } 
    
//     if (phone.length > 13) return 'Phone number must not exceed 13 characters';
    
//     return '';
//   };

//   const validate = () => {
//     const newErrors = {};
    
//     if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
//     if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    
//     if (!formData.phoneNumber.trim()) {
//       newErrors.phoneNumber = 'Phone number is required';
//     } else {
//       const phoneError = validatePhoneNumber(formData.phoneNumber);
//       if (phoneError) newErrors.phoneNumber = phoneError;
//     }
    
//     if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     } else if (!/[A-Z]/.test(formData.password)) {
//       newErrors.password = 'Password must contain at least one uppercase letter';
//     } else if (!/[0-9]/.test(formData.password)) {
//       newErrors.password = 'Password must contain at least one number';
//     }
    
//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     if (!formData.cv) {
//       newErrors.cv = 'CV is required';
//     } else if (formData.cv.type !== 'application/pdf') {
//       newErrors.cv = 'CV must be a PDF file';
//     }

//     if (!formData.certificates) {
//       newErrors.certificates = 'certificates is required';
//     } else if (formData.certificates.type !== 'application/pdf') {
//       newErrors.certificates = 'certificates must be a PDF file';
//     }

//     if (!formData.photo) {
//       newErrors.photo = 'Photo is required';
//     } else if (!formData.photo.type.startsWith('image/')) {
//       newErrors.photo = 'Photo must be an image file (JPG/PNG)';
//     }

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setApiError(null);

//     const validationErrors = validate();
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length === 0) {
//       try {
//         const formDataToSend = new FormData();
//         formDataToSend.append('email', formData.email.toLowerCase().trim());
//         formDataToSend.append('password', formData.password);
//         formDataToSend.append('confirm_password', formData.confirmPassword);
//         formDataToSend.append('full_name', formData.fullName.trim());
//         formDataToSend.append('phone_number', formData.phoneNumber.trim());
//         formDataToSend.append('cv', formData.cv);
//         formDataToSend.append('certificates', formData.certificates);
//         formDataToSend.append('photo', formData.photo);

//         const response = await fetch('http://localhost:8000/api/jobseeker/register/', {
//           method: 'POST',
//           body: formDataToSend,
//         });

//         const data = await response.json();

//         // Check for successful status (200-299)
//         if (response.status >= 200 && response.status < 300) {
//           setSubmitted(true);
//           setFormData(initialFormState);
//           setTimeout(() => navigate('/jobseeker/login'), 2000);
//           return;
//         }

//         // Handle errors
//         if (data.errors) {
//           const frontendErrors = {};
//           Object.keys(data.errors).forEach(key => {
//             const frontendKey = 
//               key === 'full_name' ? 'fullName' :
//               key === 'phone_number' ? 'phoneNumber' :
//               key === 'confirm_password' ? 'confirmPassword' :
//               key;
//             frontendErrors[frontendKey] = data.errors[key].join(' ');
//           });
//           setErrors(frontendErrors);
//         } else {
//           setApiError(data.detail || data.message || 'Registration failed. Please try again.');
//         }
//       } catch (error) {
//         console.error('Registration error:', error);
//         setApiError('Network error. Please check your connection and try again.');
//       } finally {
//         setIsLoading(false);
//       }
//     } else {
//       setIsLoading(false);
//     }
//   };

//   const getError = (fieldName) => errors[fieldName] || null;

//   const styles = {
//     container: {
//       maxWidth: '500px',
//       margin: '40px auto',
//       padding: '30px',
//       border: '1px solid #ddd',
//       borderRadius: '15px',
//       backgroundColor: '#fff',
//       boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
//     },
//     heading: {
//       textAlign: 'center',
//       marginBottom: '25px',
//       color: '#333',
//       fontSize: '24px',
//       fontWeight: '600',
//     },
//     inputContainer: {
//       position: 'relative',
//       display: 'flex',
//       alignItems: 'center',
//       marginBottom: '15px',
//     },
//     icon: {
//       position: 'absolute',
//       left: '15px',
//       color: '#666',
//     },
//     input: {
//       width: '100%',
//       padding: '12px 15px 12px 40px',
//       marginBottom: '5px',
//       borderRadius: '8px',
//       border: '1px solid #ddd',
//       fontSize: '14px',
//       transition: 'all 0.3s',
//     },
//     inputError: {
//       borderColor: '#ff4d4d',
//       backgroundColor: '#fff9f9',
//     },
//     toggleButton: {
//       position: 'absolute',
//       right: '15px',
//       background: 'none',
//       border: 'none',
//       color: '#666',
//       cursor: 'pointer',
//       fontSize: '16px',
//     },
//     button: {
//       width: '100%',
//       padding: '14px',
//       backgroundColor: '#4a6bff',
//       color: '#fff',
//       border: 'none',
//       borderRadius: '8px',
//       cursor: 'pointer',
//       fontSize: '16px',
//       fontWeight: '600',
//       marginTop: '20px',
//       transition: 'all 0.3s',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       gap: '8px',
//     },
//     buttonLoading: {
//       opacity: 0.7,
//       cursor: 'not-allowed',
//     },
//     spinner: {
//       display: 'inline-block',
//       width: '16px',
//       height: '16px',
//       border: '2px solid rgba(255,255,255,0.3)',
//       borderRadius: '50%',
//       borderTopColor: '#fff',
//       animation: 'spin 1s ease-in-out infinite',
//     },
//     error: {
//       color: '#ff4d4d',
//       fontSize: '12px',
//       marginTop: '-10px',
//       marginBottom: '15px',
//     },
//     apiError: {
//       color: '#ff4d4d',
//       fontSize: '14px',
//       textAlign: 'center',
//       marginBottom: '20px',
//       padding: '10px',
//       backgroundColor: '#fff9f9',
//       borderRadius: '8px',
//       border: '1px solid #ffcccc',
//     },
//     label: {
//       display: 'flex',
//       alignItems: 'center',
//       fontWeight: '500',
//       margin: '15px 0 8px',
//       color: '#444',
//       fontSize: '14px',
//     },
//     fileInput: {
//       width: '100%',
//       padding: '10px',
//       borderRadius: '8px',
//       border: '1px solid #ddd',
//       fontSize: '14px',
//       transition: 'all 0.3s',
//     },
//     success: {
//       color: '#4BB543',
//       fontSize: '16px',
//       textAlign: 'center',
//       marginBottom: '20px',
//       fontWeight: '500',
//     },
//     form: {
//       display: 'flex',
//       flexDirection: 'column',
//     },
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       style={styles.container}
//     >
//       <motion.h2 
//         style={styles.heading}
//         initial={{ scale: 0.9 }}
//         animate={{ scale: 1 }}
//         transition={{ delay: 0.2 }}
//       >
//         Register & Complete Your Profile
//       </motion.h2>
      
//       {submitted ? (
//         <motion.p 
//           style={styles.success}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           Registration successful! Redirecting to login...
//         </motion.p>
//       ) : (
//         <>
//           {apiError && (
//             <motion.div
//               style={styles.apiError}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             >
//               {apiError}
//             </motion.div>
//           )}

//           <form onSubmit={handleSubmit} style={styles.form} encType="multipart/form-data">
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//             >
//               <div style={styles.inputContainer}>
//                 <FaUser style={styles.icon} />
//                 <input
//                   type="text"
//                   name="fullName"
//                   placeholder="Full Name"
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   style={{
//                     ...styles.input,
//                     ...(getError('fullName') && styles.inputError)
//                   }}
//                 />
//               </div>
//               {getError('fullName') && (
//                 <motion.p style={styles.error}>
//                   {getError('fullName')}
//                 </motion.p>
//               )}
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.4 }}
//             >
//               <div style={styles.inputContainer}>
//                 <FaEnvelope style={styles.icon} />
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email Address"
//                   value={formData.email}
//                   onChange={handleChange}
//                   style={{
//                     ...styles.input,
//                     ...(getError('email') && styles.inputError)
//                   }}
//                 />
//               </div>
//               {getError('email') && (
//                 <motion.p style={styles.error}>
//                   {getError('email')}
//                 </motion.p>
//               )}
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.5 }}
//             >
//               <div style={styles.inputContainer}>
//                 <FaPhone style={styles.icon} />
//                 <input
//                   type="text"
//                   name="phoneNumber"
//                   placeholder="Phone Number (e.g., +255123456789)"
//                   value={formData.phoneNumber}
//                   onChange={handleChange}
//                   style={{
//                     ...styles.input,
//                     ...(getError('phoneNumber') && styles.inputError)
//                   }}
//                 />
//               </div>
//               {getError('phoneNumber') && (
//                 <motion.p style={styles.error}>
//                   {getError('phoneNumber')}
//                 </motion.p>
//               )}
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.6 }}
//             >
//               <div style={styles.inputContainer}>
//                 <FaLock style={styles.icon} />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   placeholder="Password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   style={{
//                     ...styles.input,
//                     ...(getError('password') && styles.inputError)
//                   }}
//                 />
//                 <button 
//                   type="button" 
//                   onClick={() => setShowPassword(!showPassword)}
//                   style={styles.toggleButton}
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//               {getError('password') && (
//                 <motion.p style={styles.error}>
//                   {getError('password')}
//                 </motion.p>
//               )}
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.7 }}
//             >
//               <div style={styles.inputContainer}>
//                 <FaLock style={styles.icon} />
//                 <input
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   name="confirmPassword"
//                   placeholder="Confirm Password"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   style={{
//                     ...styles.input,
//                     ...(getError('confirmPassword') && styles.inputError)
//                   }}
//                 />
//                 <button 
//                   type="button" 
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   style={styles.toggleButton}
//                 >
//                   {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//               {getError('confirmPassword') && (
//                 <motion.p style={styles.error}>
//                   {getError('confirmPassword')}
//                 </motion.p>
//               )}
//             </motion.div>

//             {['cv', 'certificates', 'photo'].map((field, index) => (
//               <motion.div
//                 key={field}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.8 + index * 0.1 }}
//               >
//                 <label style={styles.label}>
//                   {field === 'photo' ? <FaImage /> : <FaFilePdf />}
//                   {`Upload ${field.charAt(0).toUpperCase() + field.slice(1)} `}
//                   {field === 'photo' ? '(JPG/PNG)' : '(PDF)'}
//                 </label>
//                 <input
//                   type="file"
//                   name={field}
//                   accept={field === 'photo' ? 'image/*' : '.pdf'}
//                   onChange={handleChange}
//                   style={{
//                     ...styles.fileInput,
//                     ...(getError(field) && styles.inputError)
//                   }}
//                   required
//                 />
//                 {getError(field) && (
//                   <motion.p style={styles.error}>
//                     {getError(field)}
//                   </motion.p>
//                 )}
//               </motion.div>
//             ))}

//             <motion.button 
//               type="submit" 
//               style={{
//                 ...styles.button,
//                 ...(isLoading && styles.buttonLoading)
//               }}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 1.1 }}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <span style={styles.spinner}></span>
//                   Registering...
//                 </>
//               ) : 'Register'}
//             </motion.button>
//           </form>
//         </>
//       )}
//     </motion.div>
//   );
// };

// export default RegisterWithProfileUpload;