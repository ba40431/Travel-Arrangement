# [Travel-Arrangement](https://travel-arrangement.website/)

The project aim at automating to arrange a travel itinerary by choosing the departure date and the location where user want to go in Taiwan. Meanwhile, user can share this itinerary with friends.<br/>

Website link : https://travel-arrangement.website/<br/>
Test account : test@test<br/>
Test password : test


## Architecture
---

![architecture](https://imgur.com/dZfsT0k)

## Database Schema (MySQL)
---

![database](https://imgur.com/mSwU0dW)

## Use Skills
---

* Use Node.js / Express.js as server framework.
* Storage profile pictures and accelerate content delivery by AWS S3 and CloudFront.
* Improve AWS RDS performance with foreign key and inner join.
* Improve itinerary's reading speed by AWS ElastiCache. 
* Setup CI / CD pipeline with Jenkins.
* Support Google OAuth 2.0 login.
* Authorize users using JSON Web Tokens.

## Main Features
---
* Arrange a travel itinerary<br/>
Use Haversine formula in SQL Queries to search attractions.<br/>
![demo-1](https://imgur.com/PNNRaK5)<br/>

* Administration authority<br/>
Share itinerary to user's friend.<br/>
![demo-5](https://imgur.com/EgSNjLX)<br/>

* Use service worker<br/>
Set reminder to remind user about the itinerary will be comming. <br/>
![demo-4](https://imgur.com/ZB6YclS)<br/>
![demo-7](https://imgur.com/TKl2suS)

## Side Features
---
* Check attractions & hotels information<br/>
![demo-2](https://imgur.com/CqU670e)<br/>

* Check users itineraries<br/>
![demo-3](https://imgur.com/a493km5)<br/>

* Login / Register<br/>
![demo-6](https://imgur.com/FgbkdzB)<br/>

* Easily change user's profile picture<br/>
![demo-10](https://imgur.com/VbP741x)<br/>

## Contact
---
Abby Ho <br/>
E-mail : ba40431@gmail.com