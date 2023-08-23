import React, { useEffect, useState } from 'react'
import { Button,Modal, Card, Col, Row, Layout ,Spin} from 'antd'
import './Style.less'
import {  InfoCircleOutlined } from '@ant-design/icons'
import { Content } from 'antd/lib/layout/layout';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1'
const API_URL_OFFER = `${API_URL}/offer`
const API_URL_FEATURE = `${API_URL}/feature`
const API_URL_ORGANIZATION = `${API_URL}/organizations`
const API_URL_UPGRADE_OFFER = `${API_URL}/upgradeOffer`

const index = () => {
const [offerList,setOfferList]=useState([]);
const [featureList,setFeatureList]=useState([]);
const [userOffer,setUserOffer]=useState(0);
const [userOfferCode,setUserOfferCode]=useState("");
const [isLoading, setIsLoading] = useState(true);
const [confirmLoading, setConfirmLoading] = useState(false);
const [modalText, setModalText] = useState('Êtes-vous sûr de vouloir changer votre offre de souscription');
const [newOffer,setNewOffer] = useState(0)
const [isModalOpen, setIsModalOpen] = useState(false);
const token =  window.localStorage.getItem('jwtAccess');
const config = {
  headers: { Authorization: `Bearer ${token}` },
  params: {
    owner:window.localStorage.getItem('user_id')
  }
  }

const showModal = (offerId: any) => {
  setIsModalOpen(true);
  setNewOffer(offerId);
  console.log(newOffer)
};
const handleOk = () => {

  setConfirmLoading(true);
  setModalText(`S'il vous plaît, attendez ......`);
  const updateOffer =async() => {
    await axios.patch(`${API_URL_UPGRADE_OFFER}/${window.localStorage.getItem('organization')}/`,{offer:newOffer}, {headers: { Authorization: `Bearer ${token}` }})
  }
  updateOffer()
  setIsModalOpen(false);
  setConfirmLoading(false);
  setModalText('Êtes-vous sûr de vouloir changer votre offre de souscription');
  window.location.href = '/welcome'
};
const handleCancel = () => {
  setIsModalOpen(false);
};

  useEffect(() => {
    const fetchOffers =async() => {
      axios.get(`${API_URL_OFFER}`)
      .then(response => {
        setOfferList(response.data.results.filter(result => result.module.code.includes("Compta")));

        axios.get(`${API_URL_FEATURE}`)
        .then(response2 => {
          let features=[]
          response.data.results.filter((result: any) => result.module.code.includes("Compta")).map(offer => {
            response2.data.map((feature: any) =>{
              if(offer.id==feature.offer)
              {
                features.push(feature)
              }
            })
          })
           setFeatureList(features);
           setIsLoading(false);
        }).catch(error => {
          console.log(error)
        })
      }).catch(error => {
        console.log(error)
      })
  }
  const fetchOrganisationOffer =() => {
     axios.get(`${API_URL_ORGANIZATION}/${window.localStorage.getItem('organization')}`,config)
    .then(response => {
      setUserOffer(response.data.offer)
       axios.get(`${API_URL_OFFER}/${response.data.offer}`).then(response2 => {
        console.log("response2",response2.data)
        setUserOfferCode(response2.data.code)
        console.log("userOfferCode",userOfferCode)
       }).catch(error => {
        console.log(error)
      });

    }).catch(error => {
      console.log(error)
    });


  }
  fetchOrganisationOffer()
  fetchOffers()
  console.log("offfer",userOffer,"offercode",userOfferCode )
  }, [userOffer]);



  const getAllFeature= (offer: any)=>{
    const features= []
    while(offer.child!=null)
    {
     featureList.map((feature: any)=>{
      if(feature.offer==offer.child.id){
        features.push(feature);
      }
     })
      offer=offer.child
    }
   return features.reverse();
  }



  return (

   (offerList!=[]) ?  <Layout>
   {

     <Content>


       <Card>

       {isLoading ?<Spin size="large" />:
        <div className="container">

        <h2 className="page-subtitle">Découvrez nos offres</h2>
        <div className="site-card-wrapper">
          <Row gutter={16} >
            {offerList.map((offer,indice) => {
              return (

                <Col key={offer.id}  span={8} className="offer-column" >

                  <Card key={offer.id} className="card-content" bordered={true} >

                    <div className="card-header" style={{marginBottom:-150}}>
                      <div className="title" id={`offer${indice}`}>{offer.name}</div>
                      </div>
                    <div className="money">
                      <div className="left-part">{offer.price} &euro;	</div>
                      <div className="right-part">/mois</div>
                    </div>

                    {userOfferCode=="Compta1" || userOfferCode=="Compta3" || userOfferCode=="Compta2" && offer.code=="Compta1"?
                  <Button disabled className="btn" type="primary" shape="round"  onClick={()=>showModal(offer.id)} > Upgrade</Button>:
                  userOffer==offer.id ?
                  <Button disabled className="btn" type="primary" shape="round"  onClick={()=>showModal(offer.id)} > Upgrade</Button>:
             <Button  className="btn" type="primary" shape="round"  onClick={()=>showModal(offer.id)} >Upgrade</Button>
                    }


                  <Modal title="Confirmation" confirmLoading={confirmLoading} visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                  <h3>{modalText}</h3>
                  </Modal>



                    {getAllFeature(offer).map(feature => {

                       return (
                         <div key={feature.id} className="advantages">
                           <InfoCircleOutlined /> {feature.description}
                         </div>
                       )
                    })}

                   {offer.feature_set.map(feature => {

                   return (
                     <div key={feature.id} className="advantages-important">
                       <InfoCircleOutlined /> {feature.description}

                     </div>
                   )
                   })}

                  </Card>
                </Col>
              )
            })}
          </Row>
        </div>

        <hr className="page-divider" />
        <h2 className="page-subtitle">Comparez nos offres en détail</h2>
        <table>
          <tr>
            <td className="td-buttons feature-option"> </td>
            {offerList.map(offer => {
              return (
                <td key={offer.id} className="td-buttons checked-option">
                  <div>{offer.name}</div>
                  <div className="left-part" style={{fontSize:30}}>{offer.price} &euro;	</div>
                  <div className="right-part"> </div>
                </td>
              )
            })}
          </tr>
          <tr>
            <td className="td-buttons feature-option"> </td>
            {offerList.map(offer => {
              return (
               <td key={offer.id} className="td-buttons checked-option"> </td>

               )
             })}


          </tr>
        </table>
        <table className="table-bordered">
          <thead>
            <th className="feature-option">Les Avantages des offres</th>
            <th className="checked-option" />
            <th className="checked-option" />
            <th className="checked-option" />
          </thead>
          {featureList.map(feature => {
              return (
                <tbody key={feature.id}>

                      <tr>
                        <td className="feature-option">{feature.description}</td>
                        {offerList.map(offer =>{


                           if(feature.offer===offer.id|| getAllFeature(offer).includes(feature))
                           return (
                             <td className="checked-option"><img src={require("../../assets/blue-circle.png")} /></td>
                           )
                           else
                           return (
                             <td> </td>
                           )

                        })}


                      </tr>
                </tbody>
              )
          })}
        </table>
      </div>

}
       </Card>
     </Content>
   }
 </Layout>: <div>Wait while loading data</div>
  )
}

export default index;
