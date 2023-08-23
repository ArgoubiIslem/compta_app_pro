import React from 'react';
import { Button ,Carousel} from 'antd';
import { useHistory } from "react-router-dom";


const items = [
  {
    key: '1',
    title: 'Gérez votre comptabilité avec succès',
    content: ' Avec Innerp Business Cloud, vous gérez votre comptabilité, vos devis/factures ou gestion commerciale. Avec notre logiciel de comptabilité, nous faisons de vous un pro de la compta',
  },
  {
    key: '2',
    title: 'Gérez votre comptabilité avec succès',
    content:  ' Avec Innerp Business Cloud, vous gérez votre comptabilité, vos devis/factures ou gestion commerciale. Avec notre logiciel de comptabilité, nous faisons de vous un pro de la compta',
  },

]

function AppHomeCompta() {

  const history = useHistory();

  function handleClick(){
    history.push("Comptabilite");
  }
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

export default AppHomeCompta;
