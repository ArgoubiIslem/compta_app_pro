import React, {useContext, useState, useEffect} from 'react';

import  JwtContextProvider, {JwtContext}  from "../../provider/JwtContextProvider";
import { Modal,  Row, Col, Avatar} from "antd";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { useSpeechSynthesis } from 'react-speech-kit';
import axios from "axios";

const ReconnaissanceVocal  : React.FC = () => {
    const [visible, setVisible] = useState(false);
    const { speak } = useSpeechSynthesis();
    const API_URL = process.env.REACT_APP_API_URL;
    const API_URL_FiscalYears= `${API_URL}/fiscalyears`  
    const API_URL_ARGUMENT = `${API_URL}/arguments`  
    const status  = useContext(JwtContext);
    const token  = status.jwtAccess;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
    /*  const detectedCall =() => {
        console.log("heard donia")
    }
      const commands = [
        {
          command: 'Salut Dounia',
          callback: detectedCall()
        }
    ]*/
    const { transcript, resetTranscript } = useSpeechRecognition({})
    const [clicked , setClicked ] = useState(true)
    const [listen , setListen ] = useState(true)
    
    
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null
      }
      
      const speechProcess = () => {
        
        var id = "" ;
        for(let i = 0; i <transcript.length ; i++){
            if(transcript[i].match(/^-?\d+$/)){
                console.log("transcript[i] num ", transcript[i])
                id= id + transcript[i];
        }                
    }
    console.log(id)
    if(transcript.includes("organisations")) {
        window.location.href = "/mesComptes/ref/organisation";               
    }
    else if(transcript.includes("balance")) {
        window.location.href = "/etats/banlance";
    }
    else if(transcript.includes("écritures")) {
        window.location.href = "/saisie/ecritureComptable";
    }
    else if(transcript.includes("grand livre")) {
        window.location.href = "/etats/grandLivre";
    }
    else if(((transcript.includes("détail") || (transcript.includes("numéro") ))&&  (transcript.includes("écriture") || transcript.includes("transaction"))) && id != "") {              
            window.location.href = `/saisie/transaction/${id}`               
    }
    else if((transcript.includes("modifie") || transcript.includes("transforme") || transcript.includes("change") || transcript.includes(" en ") || transcript.includes(" vers ")) && transcript.includes("année fiscale") && id != "") {
        axios.get(`${API_URL_FiscalYears}/?organization=${status.organization}`, config)
        .then(response => {
            
            let value =   response.data.results.find((index: any) => index.year == id )
            console.log(value, "value")
            if(value.id) {
                status.ChangeFiscal(value.id);  
                window.location.reload();
            }
            
        }).catch(error => {
        })
        //status.ChangeFiscal(value);  
       // window.location.reload();
    }
    else if((transcript.includes("modifie") || transcript.includes("transforme") || transcript.includes("change") ) && (transcript.includes(" vers ") || transcript.includes(" en ")) && transcript.includes("organisation")) {
        var arrtranscript = transcript.split(" ")
        console.log("inside")
        let org = "" 
        for(let i=0; i<arrtranscript.length ; i++) {
           
            if(arrtranscript[i]== "en" || arrtranscript[i] == "vers") {
                org = arrtranscript[i + 1]? arrtranscript[i + 1] : ""
            }
        }
        console.log(org, "org")
        if(org != "") {
            axios.get(`${API_URL_ARGUMENT}/${status.argument}`, config)
        .then(response => {
           let listOrg = response.data.organizations
            let value = listOrg.find((index:any) => index.display_name.toLowerCase().includes(org.toLowerCase()))
            
            console.log(value, "value")
            if(value.id) {
                status.changeOrganisation(value.id);  
                axios.get(`${API_URL_FiscalYears}/?organization=${value.id}`, config)
                .then(response => {
                    status.ChangeFiscal(response.data.results[0].id);    
                    window.location.reload();  
                }).catch(error => {
                })               
               
            }
            
        }).catch(error => {
        })
    }
   
    }
    else {
        showModal()
    }
      }
      const detectSpeech = () => {
        console.log("loaded success"); 
        SpeechRecognition.startListening({ language: 'fr-FR', continuous: true })
        if (transcript.includes("salut") && (transcript.includes("Dounia") || transcript.includes("Donia") )) {
            //setListen(false)
            SpeechRecognition.stopListening()
            resetTranscript()
            speak({ text: "I am listening" , lang: "fr-FR" ,  voice : "Google FR FrenchS Female"})
            SpeechRecognition.startListening({ language: 'fr-FR' })
            speechProcess()
            SpeechRecognition.stopListening()
            resetTranscript()
        }
        else {
            console.log("je comprend pas   =>", transcript)
        }
      
    }
  /*  useEffect(() => {
        const interval = setInterval(() => {
        
          if(listen){ 
            console.log('This will run every second!');
            SpeechRecognition.startListening({ language: 'fr-FR' , continuous: true })
           // setTimeout(()=> { SpeechRecognition.stopListening()}, 5000 )
            
            console.log(transcript, "trans")
            if ((transcript.includes("salut") || transcript.includes("hey")) && (transcript.includes("Dounia") || transcript.includes("Donia") )) {
            setListen(false)
            speak({ text: "I am listening" , lang: "fr-FR" ,  voice : "Google FR FrenchS Female"})
            speechProcess()
            
            
            
        }
            else {
                setListen(true)
                console.log("i am listening cuz didn't understand")

            }
        }
        }, 7000);
        return () => clearInterval(interval);
      }, []);
   /* while (listen) {
        SpeechRecognition.startListening({ language: 'fr-FR' })
        if ((transcript.includes("salut") || transcript.includes("hey")) && (transcript.includes("Dounia") || transcript.includes("Donia") )) {
            setListen(false)
            SpeechRecognition.stopListening()
            resetTranscript()
            speak({ text: "I am listening" , lang: "fr-FR" ,  voice : "Google FR FrenchS Female"})
            SpeechRecognition.startListening({ language: 'fr-FR' })
            speechProcess()
            SpeechRecognition.stopListening()
            resetTranscript()
            setListen(true)
        }
    }*/
      const showModal = () => {
        setVisible(true);
        speak({ text: "I can't understand, can you repeat please" , lang: "fr-FR"})
      };
    
      const handleCancel = (e:any) => {
        setVisible(false);
      };
    
    const speechToText  = () => {
      
        
        if(clicked) {
           setClicked(false) 
            console.log("clicked true")
            SpeechRecognition.startListening({ language: 'fr-FR' })
            setListen(false)
            
        }
        else {
            setClicked(true)
            console.log("clicked false")
            SpeechRecognition.stopListening()
            speechProcess()
            console.log(transcript, " <= transcript dicté ")
            resetTranscript()
            setListen(true)
        }
    }


    //style={{ position: '-webkit-sticky',  position: 'sticky', top : '92%', paddingLeft:'95%', zIndex: 99}}
    //Avatar src={require('../../assets/mic.png') }  size="large" 
    //onLoad={() => detectSpeech()} 
    return (
        <JwtContextProvider>
       
        <Row >
        
            <Col style={{}}> 
            <Avatar src={require('../../assets/mic.png') }  size="large"  onClick={() => speechToText()}/>
            </Col>
       
       </Row >
       <Modal
          title="Commande Vocal"
          visible={visible}
         
          onCancel = {handleCancel}
          footer = {null}
         
        >
          <p> Je ne comprends pas , pouvez vous répéter ?</p>
          
          
        </Modal>
        </JwtContextProvider>
    )
}

export default ReconnaissanceVocal