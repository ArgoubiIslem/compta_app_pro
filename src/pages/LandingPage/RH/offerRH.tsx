import React,{ useState,useEffect} from 'react';
import { List, Card } from 'antd';
import axios from 'axios'
import { Link } from 'react-router-dom';
const API_URL = 'http://localhost:8000/api/v1'
const API_URL_OFFER = `${API_URL}/offer`
const API_URL_FEATURE = `${API_URL}/feature`





function AppOffersRH() {

    const [offerList,setOfferList]=useState([]);
    const [featureList,setFeatureList]=useState([]);

    useEffect(() => {
      axios.get(`${API_URL_OFFER}`)
      .then(response => {
        setOfferList(response.data.results.filter(result => result.module.code.includes("RH")));
        axios.get(`${API_URL_FEATURE}`)
        .then(response2 => {
          const features: any[] =[]
          response.data.results.filter(result => result.module.code.includes("RH")).map(offer => {
            response2.data.map(feature =>{
              if(offer.id==feature.offer)
              {
                features.push(feature)
              }
            })
          })
           setFeatureList(features);
        }).catch(error => {
          console.log(error)
        })
      }).catch(error => {
        console.log(error)
      })
    }, []);

     const getAllFeature= (offer: any)=>{
        const features: any= []
        while(offer.child!=null)
        {
         featureList.map((feature: any)=>{
          if(feature.offer==offer.child.id){
            features.push(feature);
          }
         })

          offer=offer.child
        }

       return features;
      }

const data=offerList

  return (
    <div>
    <div id="pricing" className="block pricingBlock bgGray">
      <div className="container-fluid">
        <div className="titleHolder">
          <h2>Offres de Souscription Paie & RH</h2>
          <p>Découvrez nos offres</p>
        </div>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 3,
            lg: 3,
            xl: 3,
            xxl: 3,
          }}
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <Card title={item.name}>
                <p className="large">{item.price} &euro;/mois</p>
                {getAllFeature(item).map(feature => {

                return (
                <p key={feature.id} >
                   {feature.description}
                </p>
                )
                })}

                {item.feature_set.map(feature => {
                return (
                <p key={feature.id} style={{fontWeight:"bold"}}>
                {feature.description}
                </p>
                )
                })}
                <a className="inscription">
                <span>
                <Link style={{color: 'white'}} to={`/user/register/${item.id}`}  type="link">
                S'inscrire
                </Link>
                </span>
                </a>
              </Card>
            </List.Item>
          )}
        />
      </div>
      <div id="pricing" className="block pricingBlock bgGray">
      <div className="container-fluid">
      <div className="titleHolder">
          <h2>Comparez nos offres en détail</h2>
        </div>
           <table>
             <tr>
               <td className="td-buttons feature-option"> </td>
               {offerList.map(offer => {
                 return (
                   <td key={offer.id} className="td-buttons checked-option">
                     <div>{offer.name}</div>
                     <div className="left-part">10 &euro;	</div>
                     <div className="right-part">/mois</div>
                   </td>
                 )
               })}
             </tr>
             <tr>
               <td className="td-buttons feature-option"> </td>



             </tr>
           </table>
           <table className="table-bordered">
             <tr>
               <th className="feature-option">Les Avantages des offres</th>
               <th className="checked-option" />
               <th className="checked-option" />
               <th className="checked-option" />
             </tr>
             {featureList.map(feature => {
                 return (
                   <>

                         <tr>
                           <td className="feature-option">{feature.description}</td>
                           {offerList.map(offer =>{


                              if(feature.offer===offer.id|| getAllFeature(offer).includes(feature))
                              return (
                                <td className="checked-option"><img src={require("../../../assets/blue-circle.png")} /></td>
                              )
                              else
                              return (
                                <td> </td>
                              )
                           })}
                         </tr>
                   </>
                 )
             })}
           </table>
           </div>
    </div></div>
    </div>
  );
}

export default AppOffersRH;
