import { useState } from "react"
import './style.css'
type UserNameModal = {
    title: string,
    subtitle: string,
    onEnter: (userName: string) => void
}

const UserNameModal = ({title, subtitle, onEnter}: UserNameModal) => {
    const [userName, setUserName] = useState('')
    const [userNameError, setUserNameError] = useState<String | null>(null)

    const handleUserNameErrors = (userName: string) => {
        var specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
          // Check if username is not empty
       if (userName.trim() === "") {
           setUserNameError("Campo obrigatório")
       }
      
       // Check if userName has more than 10 characters
      else if (userName.length > 10) {
          setUserNameError("Máximo de 10 caracteres")
       }
      
       // Check if userName contains special characters
      
       else if (specialCharacters.test(userName)) {
           setUserNameError("Seu nick deve pode conter apenas letras e dígitos")
       }
      
       // Check if userName contains empty spaces
       else if (/\s/.test(userName)) {
           setUserNameError("Seu nick deve pode conter apenas letras e dígitos")
       }
      
       else{
         setUserNameError(null)
       }
      
       // If all checks pass, userName is valid
        
      }

    const handleUserNameChange = (event:any) => {
        setUserName(event.target.value);
   
        handleUserNameErrors(event.target.value)
     };

     const isButtonDisabled = !!userNameError || !userName

    return (
        <section className="user-name">
            <div className="user-name__card">
                <h1 className="user-name__title">{title}</h1>
                <h2 className="user-name__subtitle">{subtitle}</h2>
                <div className="user-name__input-container">
                    <input type="text" className="user-name__input" value={userName} onChange={handleUserNameChange}/>
                    <span className='user-name__input-error'>
                        {userNameError && userNameError}
                    </span>
                </div>

                <div className="user-name__button-container">
                    <button className={`user-name__button ${isButtonDisabled && 'user-name__button--disabled'}`} disabled={isButtonDisabled} onClick={() => {onEnter(userName)}}>ENTRAR</button>
                </div>
            </div>
        </section>
    )
}

export default UserNameModal