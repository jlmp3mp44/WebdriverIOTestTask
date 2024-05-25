class FooterSection {

    get twitterButton(){
        return $('[data-test*=twitter]');
    }

    get facebookButton(){
        return $('[data-test*=facebook]');
    }

    get linkedinButton(){
        return $('[data-test*=linkedin]')
    }

}

module.exports = new FooterSection();