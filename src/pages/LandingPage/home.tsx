
import { Button ,Carousel} from 'antd';
import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from 'react';

const items = [
  {
    key: '1',
    title: 'Gérez votre activité avec succès',
    content: ' Avec Innerp Business Cloud, vous gérez votre comptabilité, vos devis/factures ou gestion commerciale, votre paie et vos ressources humaines. Avec notre logiciel de comptabilité, nous faisons de vous un pro de la compta',
  },
  {
    key: '2',
    title: 'Gérez votre activité avec succès',
    content: ' Avec Innerp Business Cloud, vous gérez votre comptabilité, vos devis/factures ou gestion commerciale, votre paie et vos ressources humaines.',
  },
  {
    key: '3',
    title: 'The best app to increase your productivity',
    content: 'An vim odio ocurreret consetetur, justo constituto ex mea. Quidam facilisis vituperata pri ne. Id nostrud gubergren urbanitas sed, quo summo animal qualisque ut, cu nostro dissentias consectetuer mel. Ut admodum conceptam mei, cu eam tation fabulas abhorreant. His ex mandamus.',
  },
]


function AppHome() {

  const history = useHistory();
  const [shouldRefresh, setShouldRefresh] = useState(false);
  useEffect(() => {
    if (shouldRefresh) {
      window.location.reload();
    }
  }, [shouldRefresh]);
  function handleClick(){
    history.push("Comptabilite");
    setShouldRefresh(true);
  }
  function handleClickRh(){
    history.push("rh");
    setShouldRefresh(true);
  }
 

  const handleRefresh = () => {
    window.location.reload();
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
                  <Button  size="large" className='home-btn'onClick={handleClick}>Comptabilite</Button>
                  <Button  size="large"className="home-btn"onClick={handleClickRh}>Paie & RH</Button>
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

export default AppHome;
