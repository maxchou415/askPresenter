# askPresenter
# Introduction
Real time ask question to presenter from listener in presentation time.
# How to use
### Required
+ MongoDB
+ Node.js v7.6 or newly version

### Step
1. ```git clone https://github.com/maxyihsunchou/askPresenter.git```<br />
2. ```$ cd askPresenter && npm start``` <br />
3. ```[POST] localhost:3000/users/signup/```<br />
+ Required
  - name
  - username
  - password
4. ```[Browser] http://localhost:3000/users/signin/```

### Other
+ You need create a channel first
#### View channel questions
```[Browser] http://localhost:3000/<channel_url>/all```
<br />
#### Create question
```[Browser] http://localhost:3000/<channel_url>/new```
