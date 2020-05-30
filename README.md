# Pastefy Slim
Pastefy Slim is an simplified version of Pastefy that is exspecially made for setting a small paster in a few seconds up.

## Install
Go to your Website Directory and type `git add remote origin https://github.com/interaapps/pastefy-slim.git && git pull origin master` (Installing git on debian: `apt install git`).

## Building your own server
Creating an own server for pastefy slim is very simple. There are only 2 requests that your server has to handle yet.

A `POST` Request with parameter `contents`.
A `GET` Request with parameter `paste`.

There is no official way to save the pastes. Do it on your way.