import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Banner from "../Banner/Banner";

const FAQ = (props) => {
  return (
    <Banner >
      {/* <Banner.Header >
          Frequently Asked Questions
      </Banner.Header> */}
      <h1 style={{textAlign: 'center'}}>Frequently Asked Questions</h1>
      <Banner.Entity>
          <Banner.Question>
              How much personal information does inSite store?
          </Banner.Question>
          <Banner.Text>
              inSite: Besides given email, password, and phone number, inSite stores no other information permenantly. If a social media account has been connected to inSite, access to that account's history is stored on inSite for one hour. 
              inSite does not have access to any personal information that is stored with these connected social media accounts such as emails and passwords. If you wish to remove the information stored on inSite, you can always delete your account.<br/><br/>
              Twilio: Twilio is the service that inSite uses for 2-Factor Authentication. Twilio stores your inSite email and phone number in order to do this effectively. Twilio will not share or sell this information to 3rd parties. 
              This information is shared within the Twilio group of companies only inorder to ensure that the services provided work as expected.<br/>
              Twilio's Privacy Policy: <a href="https://www.twilio.com/legal/privacy" target="_blank" rel="noreferrer">https://www.twilio.com/legal/privacy</a><br/><br/>
              MongoDB: MongoDB is the service that inSite uses to store account information such as your email and password. MongoDB does not sell or use any information that is stored on their servers. <br/>
              MongoDB Privacy Policy: <a href="https://www.mongodb.com/legal/privacy-policy" target="_blank" rel="noreferrer">https://www.mongodb.com/legal/privacy-policy</a>
          </Banner.Text>
      </Banner.Entity>
      <Banner.Entity>
          <Banner.Question>
              Now that I am logged in to inSite, how do I log in to Reddit/Twitter/YouTube/Instagram?
          </Banner.Question>
          <Banner.Text>
              Once you have logged in and see the inSite dashboard, simply click on Authorize (Social Media) and you will be taken to a log in page for the account that you are trying to connect. 
              After logging into said account and authorizing inSite to access to your information, you will be redirected back to the inSite dashboard where you will see a preview of our graphs.
          </Banner.Text>
      </Banner.Entity>
      <Banner.Entity>
          <Banner.Question>
              I am logged into one or more social media accounts. How do I see more information about the account(s)?
          </Banner.Question>
          <Banner.Text>
              Once logged into a social media account, you can simply click on the graph in the corresponding social media's section on the inSite dashboard. This will take you to a page dedicated to insights about that specific social media account.
          </Banner.Text>
      </Banner.Entity>
      <Banner.Entity>
          <Banner.Question>
              How do I log out of a social media account through inSite?
          </Banner.Question>
          <Banner.Text>
              Clicking on the Settings button in the top right of any inSite page will take you to the settings page in which you can choose to log out of or deactivate your inSite account.
          </Banner.Text>
      </Banner.Entity>
      <Banner.Entity>
          <Banner.Question>
              How do I log out of or delete my inSite account?
          </Banner.Question>
          <Banner.Text>
              Clicking on the "Settings" button in the top right of any inSite page will take you to the settings page in which you can choose to log out of or deactivate your inSite account.
          </Banner.Text>
      </Banner.Entity>
      <Banner.Entity>
          <Banner.Question>
              How can I change my inSite password?
          </Banner.Question>
          <Banner.Text>
              Navigating to the Settings page will provide you with the option to change your inSite password.
          </Banner.Text>
      </Banner.Entity>
      <Banner.Entity>
          <Banner.Question>
              How can I share my insights?
          </Banner.Question>
          <Banner.Text>
              On any graphical representation or word cloud we make, there is an option at the bottom to either share it directly to some social media accounts. You also have the option to download it as a PNG to share manually to who or wherever you wish.
          </Banner.Text>
      </Banner.Entity>
    </Banner>
  );
};

export default FAQ;