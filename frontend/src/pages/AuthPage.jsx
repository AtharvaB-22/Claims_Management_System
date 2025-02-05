import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    // ✅ Redirect if user is already logged in
    const storedRole = localStorage.getItem("role");
    if (storedRole === "admin") navigate("/admin");
    else if (storedRole === "policyholder") navigate("/dashboard");
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //   e.preventDefault();
    
  //   const url = isLogin
  //     ? `${API_BASE_URL}/users/${formData.email}?password=${formData.password}` // Corrected Login API
  //     : `${API_BASE_URL}/users`;  // Corrected Register API

  //   try {
  //     const response = await fetch(url, {
  //       method: isLogin ? "GET" : "POST",  // GET for login, POST for register
  //       headers: { "Content-Type": "application/json" },
  //       body: isLogin ? null : JSON.stringify(formData),  // No body for GET request
  //     });

  //     const data = await response.json();
  //     console.log("API Response:", data); // Debugging

  //     if (response.ok) {
  //       // ✅ Store user details
  //       localStorage.setItem("role", data.role);
  //       localStorage.setItem("userEmail", formData.email);

  //       alert("Login Successful!");

  //       // ✅ Redirect based on role
  //       if (data.role === "admin") {
  //         navigate("/admin"); // Redirect to Admin Dashboard
  //       } else {
  //         navigate("/dashboard"); // Redirect to Policyholder Dashboard
  //       }
  //     } else {
  //       alert(`Error: ${data.error || "Something went wrong"}`);
  //     }
  //   } catch (error) {
  //     console.error("Request failed:", error);
  //     alert("Something went wrong. Please try again.");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = isLogin
    ? `${API_BASE_URL}/users/${formData.email}?password=${formData.password}`  // Corrected Login API
    : `${API_BASE_URL}/users`;  // Corrected Register API

    try {
      const response = await fetch(url, {
        method: isLogin ? "GET" : "POST",  // GET for login, POST for register
        headers: { "Content-Type": "application/json" },
        body: isLogin ? null : JSON.stringify(formData),  // No body for GET request
    });

        const data = await response.json();
        console.log("Full API Response:", data); // ✅ Debugging: Check full response

        // ✅ Verify that "user" exists in the response
        if (response.ok && data.user) {  
          if (isLogin) {

            localStorage.setItem("role", data.user.role);
            localStorage.setItem("userEmail", formData.email);
            localStorage.setItem("name", data.user.name);
            localStorage.setItem("email", data.user.email);
            localStorage.setItem("userId", data.user.id); // Ensure it's stored correctly
            
            console.log("User Data Stored:", data.user);

            // ✅ Redirect based on role
            if (data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        }else {
          alert("Registration Successful! Please log in.");
          setIsLogin(true); // Redirect to login page after registration
        }
      } else {
          console.error("Role missing in response:", data);
            alert(`Error: ${data.error || "Something went wrong"}`);
        }
    } catch (error) {
        console.error("Request failed:", error);
        alert("Something went wrong. Please try again.");
    }
};

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-[#0568a6] mb-4">
          {isLogin ? "Login" : "Register"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 border rounded-md"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border rounded-md"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-2 border rounded-md"
            required
          />
          <button
            type="submit"
            className="bg-[#0568a6] text-white p-2 rounded-md hover:bg-[#248e38] transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <div className="mt-4 text-center">
          {isLogin ? (
            <>
              <button className="text-[#248e38] hover:underline">
                Forgot Password?
              </button>
              <p className="mt-2">
                New user?{" "}
                <button
                  className="text-[#afd91a] hover:underline"
                  onClick={() => setIsLogin(false)}
                >
                  Register here
                </button>
              </p>
            </>
          ) : (
            <p>
              Already registered?{" "}
              <button
                className="text-[#afd91a] hover:underline"
                onClick={() => setIsLogin(true)}
              >
                Login here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
