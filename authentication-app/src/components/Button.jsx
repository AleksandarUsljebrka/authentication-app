const Button = ({buttonText, className,onClick}) => {

    let classNameProps = "border rounded-md w-16 text-white text-xs md:text-xl  lg:text-2xl p-2 bg-gray-600 hover:bg-gray-400 transition duration-300 ";
    classNameProps += className? className :'';

    return (
    <button
        type="submit" 
        onClick={onClick}
        className={classNameProps}>
        {buttonText}
    </button>
  )
}

export default Button