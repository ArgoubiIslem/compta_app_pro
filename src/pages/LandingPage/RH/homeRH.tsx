import React from 'react';
import { Button ,Carousel} from 'antd';
import { useHistory } from "react-router-dom";


const items = [
  {
    key: '1',
    title: 'Trouvez la solution RH et Paie adaptée à vos besoins',
    content: "Gagnez du temps et évitez les erreurs de saisie grâce aux automatismes. Nos équipes effectuent des mises à jour en temps réel pour gérer l'évolution des contraintes légales et réglementaires",
  },
  {
    key: '2',
    title: "Dématérialisez vos documents RH",
    content:  "Distribuez les bulletins de paie en quelques clics. Les documents RH sont sécurisés et accessibles dans le coffre-fort numérique de chaque salarié, et vous pouvez utiliser la signature électronique.",
  },

]

function AppHomeRH() {


  return (

    <div className="front-component">
    <div className="left-part">
      <img className="front-image" src={require('/src/assets/compta-illustration.gif')} alt="Compta Illustration" />
    </div>
    <div className="right-part">
    <div id="hero" className="heroBlock">
      <Carousel>
        {items.map(item => {
          return (
            <div key={item.key} className="container-fluid">
              <div className="content">
                <h3>{item.title}</h3>
                <p>{item.content}</p>
                <div className="btnHolder">
                  <Button href='#offers' size="large" className='home-btn'>S'inscrire</Button>
                </div>
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
    </div>
    </div>

  );
}

export default AppHomeRH;
