
const SERVER_NAME = "localhost";
const BD_CENTRALIZER_NAME = "wwweta_centralizer";
const BD_NAME = "wwweta_suporte";
const BD_USER = "root";
const BD_PASSWORD = "";

const TABLE_API_KEYS = "api_keys";
const TABLE_USERS = "user";
const TABLE_LOGINS = "logins";
const TABLE_CARDS = "card";


// SERVER_NAME="localhost"
// BD_CENTRALIZER_NAME="wwweta_centralizer"
// BD_NAME="wwweta_suporte"
// BD_USER="root"
// BD_PASSWORD=""
// TABLE_API_KEYS="api_keys"
// TABLE_USERS="user"
// TABLE_LOGINS="logins"
// TABLE_CARDS="card"

// DATABASE_URL="mysql://${BD_USER}:${BD_PASSWORD}@${SERVER_NAME}:3306/${BD_NAME}"
// CENTRALIZER_DATABASE_URL="mysql://${BD_USER}:${BD_PASSWORD}@${SERVER_NAME}:3306/${BD_CENTRALIZER_NAME}"


module.exports = {
    SERVER_NAME,
    BD_NAME,
    BD_USER,
    BD_PASSWORD,
    TABLE_API_KEYS,
    TABLE_USERS,
    TABLE_LOGINS,
    BD_CENTRALIZER_NAME,
    TABLE_CARDS,
  };