import { useState } from 'react'

const useForm = (initialState) => {
    // VALUES 
    const [values, setValues] = useState(initialState)

    // CHANGE INPUT VALUES 
    const _handleChange = (name, value) => {
        setValues(prevValues => ({ 
            ...prevValues,
            [name]: value,
        }))
    }

    // REFRESH VALUES  
    const _refresh = () => {
        setValues(initialState)
    }

    return {
        _handleChange,
        values,
        setValues,
        _refresh,
    }
}

export default useForm
