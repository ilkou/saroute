# Saroute - In-House Password Manager &middot; [![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://www.gnu.org/software/bash/) [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/ilkou/saroute/graphs/commit-activity) [![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://ilkou.github.io) 

Saroute is a simple and secure in-house password manager script built with `Bun`.

It uses `SQLite` (a simple file) to store encrypted passwords, and a hashed passkey for added security.

With `Saroute`, you can easily manage your passwords without relying on third-party services.

## Features

- **Password Encryption** — Saroute encrypts your passwords to keep them secure.

- **Passkey Protection** — A hashed passkey is required to decrypt and access your passwords.

- **User-Friendly Interface** — Saroute provides an interactive command-line interface for managing passwords.

## Prerequisites

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

Bun ships as a single executable that can be [installed](https://bun.sh/docs/installation) in a few different ways:

```sh
# with install script (recommended)
curl -fsSL https://bun.sh/install | bash

# with npm
npm install -g bun

# with Homebrew
brew tap oven-sh/bun
brew install bun

# with Docker
docker pull oven/bun
docker run --rm --init --ulimit memlock=-1:-1 oven/bun
```


## Installation

1- Clone this repository:

```sh
git clone https://github.com/ilkou/saroute.git

cd saroute
```
2- Install the required dependencies:

```sh
bun install
```

## Usage

1. Run the `Saroute` script:

```bash
bun start
```

2. The first time you run Saroute, it will prompt you to set a passkey. This passkey will be used to encrypt and decrypt your passwords, so make sure to remember it.

3. After setting the passkey, Saroute will present you with a menu of options to manage your passwords:

    - Copy Password: Copy a stored password to your clipboard.
    - Add Password: Add a new password entry.
    - Delete Password: Delete a stored password.

4. Follow the on-screen prompts to perform your desired action.

## Security

* Your passkey is hashed and securely stored in the database.

* Passwords are encrypted using the passkey before being saved.

* `Saroute` aims to provide a secure way to manage your passwords, but it's essential to keep your passkey safe and not share it with others.

## License

This project is licensed under the MIT License

## Acknowledgments

Special thanks to the [Bun](https://bun.sh/) community for their excellent tools and documentation.

