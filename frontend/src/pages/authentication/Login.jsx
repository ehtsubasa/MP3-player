import { useState } from 'react';
import { Link } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';

const Login = () => {

    const [input, setInput] = useState({
            username: '',
            password: ''
    })

    const { loading, login } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(input.username, input.password);
    }

        return (
      <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
        
        <h1 className='text-3xl font-semibold text-center text-[#f97316]'>Login</h1>

        <form onSubmit={handleSubmit}>
            <fieldset className="m-3 gap-2">
            <label className='label p-0 mt-2 ml-4'>Username: </label>
            <input type="text" className='w-full input input-border h-8 ml-2 border border-gray-100 rounded bg-{white}' 
                placeholder="ehtsubasa...???" 
                value={input.username} 
                onChange={(e) => setInput({...input, username: e.target.value})}
            />

            <label className='label p-0 mt-2 ml-4 '>Password: </label>
            <input type="password" className='w-full input input-border h-8 ml-2 border border-gray-100 rounded' 
                placeholder="••••••••••" 
                value={input.password} 
                onChange={(e) => setInput({...input, password: e.target.value})}
            />

            </fieldset>

            <Link to='/signup' className='text-[#f97316] underline'>
                {"Don't"} have an account? 
            </Link>
            
            <button type="submit" className="mt-4 ml-10 bg-[#f97316] hover:bg-[#f97316]/80 text-white font-semibold py-2 px-4 rounded">
                Login
            </button>

        </form>

      </div>
  )
};
export default Login;