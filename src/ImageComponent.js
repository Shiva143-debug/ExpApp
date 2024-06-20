import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const ImageComponent=()=>{
    // const {imageUrl}=props
    // console.log(imageUrl)
    const navigate = useNavigate();
    const location = useLocation();
    const imageUrl = location.state;

    const Back=()=>{
        navigate("/reports")
    }

    return(
        <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
         <img src={imageUrl} alt="selectedPic" width={250}/>
         <button class="btn btn-primary mt-5" onClick={Back} style={{width:"250px"}}>Back</button>
         </div>
    )

}

export default ImageComponent