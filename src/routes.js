/* eslint-disable import/no-anonymous-default-export */
const apiPath = 'https://api.green-api.com/waInstance';
const sendMessage = 'sendMessage';
const getStateInstance = 'getStateInstance';
const checkWhatsapp = 'checkWhatsapp';
const receiveNotification = 'receiveNotification';
const deleteNotification = 'deleteNotification';

export default {
	authorization: (idInstance, apiTokenInstance) => [apiPath + idInstance, getStateInstance, apiTokenInstance].join('/'),
	sendMessage: (idInstance, apiTokenInstance) => [apiPath + idInstance, sendMessage, apiTokenInstance].join('/'),
	checkWhatsapp: (idInstance, apiTokenInstance) => [apiPath + idInstance, checkWhatsapp, apiTokenInstance].join('/'),
	receiveNotification: (idInstance, apiTokenInstance) => [apiPath + idInstance, receiveNotification, apiTokenInstance].join('/'),
	deleteNotification: (idInstance, apiTokenInstance, receiptId) => [apiPath + idInstance, deleteNotification, apiTokenInstance, receiptId].join('/'),
}

//https://api.green-api.com/waInstance{{idInstance}}/sendMessage/{{apiTokenInstance}}