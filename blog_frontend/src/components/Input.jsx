import React from 'react'

const Input = ({type,className,placeholder, onChange, value, required}) => {
  return (
    <div>
      <input type={type} className={`rounded border border-gray-400 focus:border-blue-500 p-2 w-52 ${className}`} placeholder={placeholder}
      onChange={onChange} value={value} required={required}/>
    </div>
  )
}

export default Input
