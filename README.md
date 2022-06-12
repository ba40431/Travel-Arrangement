# [Travel-Arrangement](https://travel-arrangement.website/)

The project aim at automating to arrange a travel itinerary by choosing the departure date and the location where user want to go in Taiwan. Meanwhile, user can share this itinerary with friends.<br/>

Website link : https://travel-arrangement.website/<br/>
Test account : test@test<br/>
Test password : test

## Catalog
* [Architecture](#Architecture)
* [Database Schema](#DatabaseSchema)
* [Use Skills](#UseSkills)
* [Main Features](#MainFeatures)
* [Side Features](#SideFeatures)
* [Contact](#Contact)

## Architecture

![Imgur](https://i.imgur.com/dZfsT0k.png)

## Database Schema

![Imgur](https://i.imgur.com/mSwU0dW.png)

## Use Skills

* Use Node.js / Express.js as server framework.
* Storage profile pictures and accelerate content delivery by AWS S3 and CloudFront.
* Improve AWS RDS performance with foreign key and inner join.
* Improve itinerary's reading speed by AWS ElastiCache. 
* Setup CI / CD pipeline with Jenkins.
* Support Google OAuth 2.0 login.
* Authorize users using JSON Web Tokens.

## Main Features
* Arrange a travel itinerary<br/>
Use Haversine formula in SQL Queries to search attractions.<br/>
<img src = 'https://i.imgur.com/PNNRaK5.gif'/>

* Administration authority<br/>
Share itinerary to user's friend.<br/>
<img src = 'https://i.imgur.com/EgSNjLX.gif'/>

* Web Notification<br/>
Set reminder by using service worker to remind user about the itinerary will be comming. <br/>
<img src = 'https://i.imgur.com/ZB6YclS.gif'/>
<img src = 'https://i.imgur.com/TKl2suS.png'/>

## Side Features
* Check attractions & hotels information<br/>
<img src = 'https://i.imgur.com/CqU670e.gif'/>

* Check user's itineraries<br/>
<img src = 'https://i.imgur.com/a493km5.gif'/>

* Login / Register<br/>
<img src = 'https://i.imgur.com/FgbkdzB.gif'/>
* Easily change user's profile picture<br/>
<img src = 'https://i.imgur.com/VbP741x.gif'/>

## Contact
Abby Ho <br/>
E-mail : ba40431@gmail.com