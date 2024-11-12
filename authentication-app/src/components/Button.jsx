const Button = ({buttonText, className,onClick, disabled=false}) => {

    let classNameProps = "border rounded-md w-16 text-white text-xs md:text-xl  lg:text-2xl py-2 transition duration-300 ";
    classNameProps += className? className :'';

    classNameProps = disabled? classNameProps+=" bg-gray-400 disabled:cursor-not-allowed":classNameProps+=" bg-gray-600 hover:bg-gray-400"
    return (
    <button
        type="submit" 
        onClick={onClick}
        disabled={disabled}
        className={classNameProps}>
        {buttonText}
    </button>
  )
}

export default Button