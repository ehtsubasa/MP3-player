import { useState } from "react";
import { Link } from "react-router-dom";


const Register = () => {
    const [input, setInput] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const handleSubmit = (e) => {
        e.preventDefault();
    }
    return (
      <div>
        <h1>Sign Up</h1>

        <form onSubmit={handleSubmit}>
            <fieldset>
            <label>Full name: </label>
            <input type="text" 
                placeholder="What do you want to be called..." 
                value={input.fullname} 
                onChange={(e) => setInput({...input, fullname: e.target.value})}
            />

            <label>Email: </label>
            <input type="text" 
                placeholder="example@gmail.com" 
                value={input.email} 
                onChange={(e) => setInput({...input, email: e.target.value})}
            />

            <label>Password: </label>
            <input type="text" 
                placeholder="••••••••••" 
                value={input.password} 
                onChange={(e) => setInput({...input, password: e.target.value})}
            />

            <label>Confirm Password: </label>
            <input type="text" 
                placeholder="••••••••••" 
                value={input.confirmPassword} 
                onChange={(e) => setInput({...input, confirmPassword: e.target.value})}
            />
            </fieldset>

            <Link to='/login'>Already have an account?</Link>
            <button type="submit">Sign Up</button>

        </form>

      </div>
  )
}
export default Register