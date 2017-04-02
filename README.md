# askPresenter
# How to use
1. Create a channel<br />
```[POST] /api/ask/new/```
+ Required:
  - ```Name``` Your channel name
  - ```URL``` Your channel url (like: CKHS)

2. Send Question<br />
```[POST] /api/ask/<channel_url>/new/<question>```<br />
Also can use browser to send question at
```/ask/<channel_url>/new```

3. View all question of a chennel (Browser)
```/ask/<channel_url>/all```
