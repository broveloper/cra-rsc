import _ from 'lodash';

const doLog = /^\?l?test/.test(document.location.search);
const doPush = /^\?p?test/.test(document.location.search);
const enabled = doLog || doPush;
const logged = [];

const logger = {
	get enabled() { return enabled; },
	get logs() { return _.map(logged, log => JSON.stringify(log)).join('\n'); },
	log: (...args) => {
		if (!logger.enabled) return null;
		if (doLog) console.log(...args);
		if (doPush) logged.push(args);
	},
	reset: () => logged.length = 0,
};

export default logger;