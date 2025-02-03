import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? "https://claims-management-system-gpit.onrender.com/users/login"
      : "https://claims-management-system-gpit.onrender.com/users/register";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);
      alert(isLogin ? "Login successful!" : "Registration successful!");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
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
