import axios from "axios"
import { changeProductsInCartStatus } from "./commonFuncs"
import dataSource from "./dbConfiguration"
const transactionRepo=dataSource.getRepository('Transaction')
const verifyTransaction=async(transaction)=>{
    const bankResponse=await axios.post('https://api.zarinpal.com/pg/v4/payment/verify.json',{
        "merchant_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "amount": transaction.price,
        "authority": transaction.authority
    },{
        headers:{
            'accept':'application/json', 
            'content-type':'application/json'
        }
        })
    if(bankResponse.status===200){
        const data=bankResponse.data.data
        const errors=bankResponse.data.errors
        const dataCode=data.code
        let resobj
        transaction.bankCode+=',2-'+dataCode
        if(dataCode===100||dataCode===101){ 
            transaction.bankMessage=data.message
            transaction.cardHash=data.card_hash
            transaction.refId=data.ref_id
            transaction.cardPan=data.card_pan
            transaction.status='success'
            transaction.productsInCart=changeProductsInCartStatus(transaction.productsInCart,'paid')
            resobj={err:null,code:100,soldProducts:transaction.productsInCart}
            // transaction.productsInCart.map((productInCart)=>{
            //     productInCart.status='paid'
            // })        
        }
        else{
            transaction.productsInCart=changeProductsInCartStatus(transaction.productsInCart,'inShoppingCart')
            if(dataCode===-50){
                transaction.status="deffprice"
                resobj={err:{message:'خظا در ثبت تراکنش لطفا سریعا با پشتیبانی تماس حاصل کنید'},code:-50}
            }
        
            else if(dataCode===-51){
                transaction.status="failed"
                resobj={err:{message:'تراکنش ناموفق'},code:-51}     
            }
            else if(dataCode===-52){
                transaction.status='unknown'
                resobj={err:{message:' خطای غیر منتظره با پشتیبانی تماس بگیرید'},code:-52}     
            }
            else if(dataCode===-53){
                transaction.status='anotherMerchantId'
                resobj={err:{message:'پرداخت غیر معتبر است'},code:-53}     
            }
            else if(dataCode===-54){
                transaction.status='invalidAuth' 
                resobj={err:{message:'خظای اعتبار'},code:-54}       
            }
            


        }
        
       
        transaction=await transactionRepo.save(transaction)
        return resobj



}
}
export default verifyTransaction