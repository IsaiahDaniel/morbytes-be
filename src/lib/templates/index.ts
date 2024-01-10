const verifyEmailTemplate = (url: string, username: string) => {
  return `
    <html>
    <head>
    <title>Your Bitbama Email Verification</title>
    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' /> 
    <link rel="icon" href="https://www.bitbama.io/images/bitbama-browser-fav.png" />
    </head>
    <body style='padding: 20px; background-color: #F7E5FF;'>
        <div style="background-color: white; box-shadow: 1px 1px 8px 1px rgba(0,0,0,0.3); border-radius: 5px; padding: 30px 20px; max-width: 600px; margin: auto;">
        <div style='width: 100%; text-align: center;  height: 60px; display: flex; 
        font-family: cursive, sans-serif;'>
        <div style='width: 100%; display: flex; justify-content: flex-start;'>
        <div style='position: relative;  height: 100%; width: 150px; margin: auto;'>
        <a style='text-decoration: none;' target="_blank" rel="noopener" href='http://app.whoosh.com.ng/'>
        <img style='position: absolute; width: 100%; height: 100%; top: 0; left: 0;
            object-fit: contain; display: block;'
            src='https://res.cloudinary.com/dirrcwgfj/image/upload/v1699299757/whoosh-red_ipmfoy.png' alt='Whoosh' /></a>
        </div>
        </div>
        </div>
        <br />
        <div style='width: 100%; text-align: center; font-size: 11px; 
        font-family: Arial, Helvetica, sans-serif; font-weight: 500; line-height: 1.4;'>
        <div style="font-weight: normal; font-size: 15px;">
        <p style="font-weight: 500; font-size: 16px;"> Hello ${username}, Welcome to Whoosh!
        </p>
        <p>Kindly click on the button below to verify your email address.</p>
        
        <div style='margin: 30px auto 0px; max-width: 150px; padding: 5px 15px; width: 100%;'>
        <a style='text-decoration: none; display: block; padding: 8px 20px;
        border-radius: 5px; background-color: #e01e08; color: white;'
        href='${url}'>Verify email</a>
        </div>
        
        <br/> <br/>
        <p style='font-size: 13px; color: grey; text-align: center;'> For help and support, kindly reach us through the following:
        </p>
        </div>
        
        <br/>
        <div style='display: flex; max-width: 100%; margin: auto;'>
        <div style='width: 33%;'>
        <div style='padding: 5px 5px; height: 35px; width: auto; opacity: 0.6;'>
        <a style='text-decoration: none;' target="_blank" rel="noopener" href='https://twitter.com/whoosh_ng'>
        <img style='width: 100%; height: 100%;
            object-fit: contain; display: block;'
            src='https://img.icons8.com/?size=96&id=13963&format=png' alt='Bitbama email' /></a>
        </div>
        </div>
        
        <div style='width: 33%;'>
        <div style='padding: 5px 5px; height: 35px; width: auto; opacity: 0.6;'>
        <a style='text-decoration: none;' target="_blank" rel="noopener" href='https://www.linkedin.com/company/whoosh-logistics-ltd/'>
        <img style='width: 100%; height: 100%;
            object-fit: contain; display: block;'
            src='https://img.icons8.com/?size=128&id=XRDimtpq5vCY&format=png' alt='Whoosh linkedin' /></a>
        </div>
        </div>
        
        <div style='width: 33%;'>
        <div style='padding: 5px 5px; height: 35px; width: auto; opacity: 0.6;'>
        <a style='text-decoration: none;' target="_blank" rel="noopener" href='https://www.instagram.com/whoosh_ng/'>
        <img style='width: 100%; height: 100%;
            object-fit: contain; display: block;'
            src='https://img.icons8.com/?size=96&id=32323&format=png" alt='Whoosh Instagram' /></a>
        </div>
        </div>
        
        </div>
        </div>
        </div>
    </body>
    </html>    
  `
};

const forgotPasswordTemplate = (url: string, username: string) => {
    return `
      <html>
      <head>
      <title>Your Bitbama Email Verification</title>
      <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' /> 
      <link rel="icon" href="https://www.bitbama.io/images/bitbama-browser-fav.png" />
      </head>
      <body style='padding: 20px; background-color: #F7E5FF;'>
          <div style="background-color: white; box-shadow: 1px 1px 8px 1px rgba(0,0,0,0.3); border-radius: 5px; padding: 30px 20px; max-width: 600px; margin: auto;">
          <div style='width: 100%; text-align: center;  height: 60px; display: flex; 
          font-family: cursive, sans-serif;'>
          <div style='width: 100%; display: flex; justify-content: flex-start;'>
          <div style='position: relative;  height: 100%; width: 150px; margin: auto;'>
          <a style='text-decoration: none;' target="_blank" rel="noopener" href='http://app.whoosh.com.ng/'>
          <img style='position: absolute; width: 100%; height: 100%; top: 0; left: 0;
              object-fit: contain; display: block;'
              src='https://res.cloudinary.com/dirrcwgfj/image/upload/v1699299757/whoosh-red_ipmfoy.png' alt='Whoosh' /></a>
          </div>
          </div>
          </div>
          <br />
          <div style='width: 100%; text-align: center; font-size: 11px; 
          font-family: Arial, Helvetica, sans-serif; font-weight: 500; line-height: 1.4;'>
          <div style="font-weight: normal; font-size: 15px;">
          <p style="font-weight: 500; font-size: 16px;"> Hello ${username},
          </p>
          <p>Kindly click on the button below to Reset your Password.</p>

          <p>Link Expires in 10 mintues.</p>
          
          <div style='margin: 30px auto 0px; max-width: 180px; padding: 5px 15px; width: 100%;'>
          <a style='text-decoration: none; display: block; padding: 8px 20px;
          border-radius: 5px; background-color: #e01e08; color: white;'
          href='${url}'>Click to reset Password</a>
          </div>
          
          <br/> <br/>
          <p style='font-size: 13px; color: grey; text-align: center;'> For help and support, kindly reach us through the following:
          </p>
          </div>
          
          <br/>
          <div style='display: flex; max-width: 100%; margin: auto;'>
          <div style='width: 33%;'>
          <div style='padding: 5px 5px; height: 35px; width: auto; opacity: 0.6;'>
          <a style='text-decoration: none;' target="_blank" rel="noopener" href='https://twitter.com/whoosh_ng'>
          <img style='width: 100%; height: 100%;
              object-fit: contain; display: block;'
              src='https://img.icons8.com/?size=96&id=13963&format=png' alt='Bitbama email' /></a>
          </div>
          </div>
          
          <div style='width: 33%;'>
          <div style='padding: 5px 5px; height: 35px; width: auto; opacity: 0.6;'>
          <a style='text-decoration: none;' target="_blank" rel="noopener" href='https://www.linkedin.com/company/whoosh-logistics-ltd/'>
          <img style='width: 100%; height: 100%;
              object-fit: contain; display: block;'
              src='https://img.icons8.com/?size=128&id=XRDimtpq5vCY&format=png' alt='Whoosh linkedin' /></a>
          </div>
          </div>
          
          <div style='width: 33%;'>
          <div style='padding: 5px 5px; height: 35px; width: auto; opacity: 0.6;'>
          <a style='text-decoration: none;' target="_blank" rel="noopener" href='https://www.instagram.com/whoosh_ng/'>
          <img style='width: 100%; height: 100%;
              object-fit: contain; display: block;'
              src='https://img.icons8.com/?size=96&id=32323&format=png" alt='Whoosh Instagram' /></a>
          </div>
          </div>
          
          </div>
          </div>
          </div>
      </body>
      </html>    
    `
};

const kycReceivedTemplate = (username: string) => {
    return `
    <html>
    <head>
    <title>Whoosh kyc verification</title>
    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' /> 
    <link rel="icon" href="" />
    </head>
    <body style='padding: 20px; background-color: #F7E5FF;'>
        <div style="background-color: white; box-shadow: 1px 1px 8px 1px rgba(0,0,0,0.3); border-radius: 5px; padding: 30px 20px; max-width: 600px; margin: auto;">
        <div style='width: 100%; text-align: center;  height: 60px; display: flex; 
        font-family: cursive, sans-serif;'>
        <div style='width: 100%; display: flex; justify-content: flex-start;'>
        <div style='position: relative;  height: 100%; width: 150px; margin: auto;'>
        <a style='text-decoration: none;' target="_blank" rel="noopener" href='http://app.whoosh.com.ng/'>
        <img style='position: absolute; width: 100%; height: 100%; top: 0; left: 0;
            object-fit: contain; display: block;'
            src='https://res.cloudinary.com/dirrcwgfj/image/upload/v1699299757/whoosh-red_ipmfoy.png' alt='Whoosh' /></a>
        </div>
        </div>
        </div>
        <br />
        <div style='width: 100%; text-align: center; font-size: 11px; 
        font-family: Arial, Helvetica, sans-serif; font-weight: 500; line-height: 1.4;'>
        <div style="font-weight: normal; font-size: 15px;">
        <p style="font-weight: 500; font-size: 16px;"> Hello ${username},
        </p>
        <p>KYC Verification</p>

        <p>We have Receive your KYC and is currently being processed, we will send an email to update your status</p>

        <p>Thank you for choosing us</p>
        
        <br/> <br/>
        <p style='font-size: 13px; color: grey; text-align: center;'> For help and support, kindly reach us through the following:
        </p>
        </div>
        
        <br/>
        <div style='display: flex; max-width: 100%; margin: auto;'>
        <div style='width: 33%;'>
        <div style='padding: 5px 5px; height: 35px; width: auto; opacity: 0.6;'>
        <a style='text-decoration: none;' target="_blank" rel="noopener" href='https://twitter.com/whoosh_ng'>
        <img style='width: 100%; height: 100%;
            object-fit: contain; display: block;'
            src='https://img.icons8.com/?size=96&id=13963&format=png' alt='Bitbama email' /></a>
        </div>
        </div>
        
        <div style='width: 33%;'>
        <div style='padding: 5px 5px; height: 35px; width: auto; opacity: 0.6;'>
        <a style='text-decoration: none;' target="_blank" rel="noopener" href='https://www.linkedin.com/company/whoosh-logistics-ltd/'>
        <img style='width: 100%; height: 100%;
            object-fit: contain; display: block;'
            src='https://img.icons8.com/?size=128&id=XRDimtpq5vCY&format=png' alt='Whoosh linkedin' /></a>
        </div>
        </div>
        
        <div style='width: 33%;'>
        <div style='padding: 5px 5px; height: 35px; width: auto; opacity: 0.6;'>
        <a style='text-decoration: none;' target="_blank" rel="noopener" href='https://www.instagram.com/whoosh_ng/'>
        <img style='width: 100%; height: 100%;
            object-fit: contain; display: block;'
            src='https://img.icons8.com/?size=96&id=32323&format=png" alt='Whoosh Instagram' /></a>
        </div>
        </div>
        
        </div>
        </div>
        </div>
    </body>
    </html>    
  `

}

export { verifyEmailTemplate, forgotPasswordTemplate, kycReceivedTemplate };
