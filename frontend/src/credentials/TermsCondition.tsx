import React from 'react';
import './TermsCondition.css';
import { Link } from 'react-router-dom';

const TermsCondition = () => {
  return (
    <div className="terms">
      <div className="terms-container">
        <h1 className="terms-title">Terms and Conditions</h1>

        <h2 className="terms-heading">1. Endangered Species</h2>
        <p className="terms-paragraph">
          By using FishCom, you agree to comply with the regulations set forth by the Department of Environment and Natural Resources (DENR) regarding the trading and handling of endangered fish species. Users are strictly prohibited from selling or purchasing fish classified as endangered or vulnerable. FishCom reserves the right to remove any listings involving species that are protected by law to ensure the preservation of aquatic biodiversity.
        </p>

        <h2 className="terms-heading">2. Non-Endangered Species</h2>
        <p className="terms-paragraph">
          FishCom encourages the responsible trade of non-endangered ornamental fish species. All users must verify the species of fish before listing them on the platform. It is the responsibility of sellers to ensure that the fish sold on FishCom do not violate any environmental regulations.
        </p>

        <h2 className="terms-heading">3. Posting Content</h2>
        <p className="terms-paragraph">
          Users are allowed to post content on the social platform strictly related to fish, aquaculture, fish habitats, and related topics. Any posts that do not pertain to fish or violate the platform’s guidelines will be removed. Content involving unrelated topics, such as non-fish-related products, services, or personal content, is strictly prohibited and may result in account suspension or termination.
        </p>

        <h2 className="terms-heading">4. Data Privacy</h2>
        <p className="terms-paragraph">
          FishCom is committed to protecting the privacy of its users. All personal information collected during the registration and use of the platform is stored securely and will only be used for the purposes of facilitating transactions, communication, and improving user experience. We do not share your personal data with third parties without your consent, except as required by law.
        </p>

        <Link to="/register">
          <button className="back-button">Back to Register</button>
        </Link>
      </div>
    </div>
  );
}

export default TermsCondition;
