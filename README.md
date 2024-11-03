# Gallery app 
## Unspalsh api 
Go to https://unsplash.com/documentation and create an account. 
Create an api key. 

## Run React App
First clone the repository.
Create a file called ```.env``` add the line ```REACT_APP_client_id = <YourApiKey>```. This gives access to the api.
Start the app by typing ```npm start``` or ```yarn start``` in a the terminal when navigated to the folder.
The application will start a new tab.

### Next step
#### Minor fixes
- If I had more time I would fix the warning for the property "key" to have a uniq key.
- Make better styling for the gallery.
#### Bigger fixes
- Add a dynamic search
- Add pagination
- Add test for the code

### Problems
When creating this app some problems occured.
#### 1. Get access to the api with category. 
When trying to get the app to access the api when a category was choosen the api didn´t really respond to it. But after some research and documentation of the api the problem could be solved by using the search endpoint of the api.
#### 2. Use .env variable. 
When creating an api key in the .env file some problems occured when trying to use the key in the app. After research the problem was that ```npm install dotenv --save``` wasn´t installed.
#### 3. Errors
When dotenv was installed the app crashed. After research on the errors it was solved after removing ```node_modules``` & ```package-lock.json``` and then install them by typing ```npm install```.
