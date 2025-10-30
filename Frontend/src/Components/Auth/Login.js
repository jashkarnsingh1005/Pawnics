import { useForm } from 'react-hook-form';
import styles from './Auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const onSubmit = async (data) => {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', data, {
      withCredentials: true, // to send and receive cookies
    });


    if (response.status === 200) {
      alert('Login successful!');
      const {accessToken} =response.data;
      if(accessToken){
        localStorage.setItem("accessToken",accessToken)
      }else{
        console.log("Token Not Received");
        
      }
      // No localStorage usage anymore

      // Navigate to homepage
      navigate('/'); // redirect to homepage
    }
  } catch (error) {
    console.error('Login error:', error);
    if (error.response) {
      alert(error.response.data.message || 'Login failed');
    } else {
      alert('An unexpected error occurred. Please try again.');
    }
  }
};


  return (
    <div className={styles.authContainer}>
      <motion.form 
        className={styles.authForm} 
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2 
          className={styles.authTitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Welcome Back to Pawnics
        </motion.h2>

        <motion.div 
          className={styles.inputGroup}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            className={styles.input}
            placeholder="Enter your email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <motion.div 
            className={styles.error}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            {errors.email.message}
          </motion.div>}
        </motion.div>

        <motion.div 
          className={styles.inputGroup}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            className={styles.input}
            placeholder="Enter your password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          {errors.password && <motion.div 
            className={styles.error}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            {errors.password.message}
          </motion.div>}
        </motion.div>

        <motion.button 
          type="submit" 
          className={styles.submitButton}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Login
        </motion.button>

        <motion.p 
          className={styles.toggleText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Don't have an account?{' '}
          <Link to="/register" className={styles.toggleLink}>Register</Link>
        </motion.p>

        <motion.div
          className={styles.decorativeElement}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.7, type: "spring" }}
        >
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15ZM65 55H55V65H45V55H35V45H45V35H55V45H65V55Z" fill="hsla(86, 45%, 54%, 0.2)"/>
          </svg>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default Login;
