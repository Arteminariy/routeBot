import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const bot = new Telegraf(process.env.TOKEN);

// Создаем объект для хранения состояния каждого пользователя
const userState = {};

bot.command('start', async (ctx) => {
	const buttons = Markup.inlineKeyboard([
		Markup.button.callback('Маршрут 1', 'route1'),
		Markup.button.callback('Маршрут 2', 'route2'),
	]);
	await ctx.reply('Добро пожаловать! Выберите маршрут:', buttons);
});

bot.action('route1', async (ctx) => {
	await ctx.reply(
		'Вы выбрали маршрут 1\nНапишите "Подсказка" в чат, чтобы получить подсказку'
	);
	// Получаем идентификатор пользователя из контекста
	const userId = ctx.from.id;
	// Устанавливаем состояние пользователя
	userState[userId] = {
		route: 'route1',
		hints: 0,
	};
});

bot.action('route2', async (ctx) => {
	await ctx.reply(
		'Вы выбрали маршрут 2\nНапишите "Подсказка" в чат, чтобы получить подсказку'
	);
	// Получаем идентификатор пользователя из контекста
	const userId = ctx.from.id;
	// Устанавливаем состояние пользователя
	userState[userId] = {
		route: 'route2',
		hints: 0,
	};
});

const bunkerRegex = /бункер(-42| 42|)/i;
const museumRegex = /музей( кулинарного искусства|)/i;

// Проверяем состояние пользователя перед отправкой подсказки
bot.hears('Подсказка', async (ctx) => {
	// Получаем идентификатор пользователя из контекста
	const userId = ctx.from.id;
	// Получаем состояние пользователя из объекта
	const user = userState[userId];
	if (user) {
		if (user.route === 'route1') {
			if (user.hints === 0) {
				const buttons = Markup.inlineKeyboard([
					Markup.button.callback('Точка №4', 'point4'),
					Markup.button.callback('Точка №5', 'point5'),
					Markup.button.callback('Точка №7', 'point7'),
					Markup.button.callback('Точка №10', 'point10'),
				]);
				await ctx.reply('Выберите точку:', buttons);
				user.hints++;
			} else {
				await ctx.reply('Больше подсказок нет');
			}
		} else if (user.route === 'route2') {
			if (user.hints === 0) {
				const buttons = Markup.inlineKeyboard([
					Markup.button.callback('Точка №4', 'point4'),
					Markup.button.callback('Точка №6', 'point6'),
					Markup.button.callback('Точка №7', 'point7'),
					Markup.button.callback('Точка №10', 'point10'),
				]);
				await ctx.reply('Выберите точку:', buttons);
				user.hints++;
			} else {
				await ctx.reply('Больше подсказок нет');
			}
		} else {
			await ctx.reply('Вы не выбрали маршрут');
		}
	} else {
		await ctx.reply('Вы не начали игру');
	}
});

// Создаем обработчики действий на одном уровне
bot.action('point4', async (ctx) => {
	const userId = ctx.from.id;
	const user = userState[userId];
	if (user) {
		if (user.route === 'route1') {
			await ctx.reply('5-й Котельнический переулок, 11');
		} else if (user.route === 'route2') {
			await ctx.reply('Верхняя Радищенская улица, 11');
		}
	}
});

bot.action('point5', async (ctx) => {
	const userId = ctx.from.id;
	const user = userState[userId];
	if (user) {
		if (user.route === 'route1') {
			await ctx.reply('Котельническая набережная, 1/15');
		}
	}
});

bot.action('point6', async (ctx) => {
	const userId = ctx.from.id;
	const user = userState[userId];
	if (user) {
		if (user.route === 'route2') {
			await ctx.reply('Котельническая набережная, 1/15');
		}
	}
});

bot.action('point7', async (ctx) => {
	const userId = ctx.from.id;
	const user = userState[userId];
	if (user) {
		if (user.route === 'route1') {
			await ctx.reply('Верхняя Радищенская улица, 11');
		} else if (user.route === 'route2') {
			await ctx.reply('5-й Котельнический переулок, 11');
		}
	}
});

bot.action('point10', async (ctx) => {
	const userId = ctx.from.id;
	const user = userState[userId];
	if (user) {
		if (user.route === 'route1') {
			await ctx.reply('Таганская улица, 40-42');
		} else if (user.route === 'route2') {
			await ctx.reply('Таганская улица, 40-42');
		}
	}
});

// Создаем обработчики сообщений на одном уровне
bot.hears(bunkerRegex, async (ctx) => {
	const userId = ctx.from.id;
	const user = userState[userId];
	if (user) {
		if (user.route === 'route1') {
			await ctx.reply('C');
			const imageStream = fs.createReadStream('img/img_1.jpg');
			await ctx.replyWithPhoto({ source: imageStream });
		} else if (user.route === 'route2') {
			await ctx.reply('C');
			await ctx.reply('Улица Большие Каменщики, 9сС');
		}
	}
});

bot.hears(museumRegex, async (ctx) => {
	const userId = ctx.from.id;
	const user = userState[userId];
	if (user) {
		if (user.route === 'route1') {
			await ctx.reply('У');
			await ctx.reply('Детский таганский парк');
		} else if (user.route === 'route2') {
			await ctx.reply('У');
			await ctx.reply('Что говорил Шекспир про весь мир?');
		}
	}
});

bot.hears('Библиотека', async (ctx) => {
	const userId = ctx.from.id;
	const user = userState[userId];
	if (user && user.route === 'route2') {
		const imageStream = fs.createReadStream('img/img_1.jpg');
		await ctx.replyWithPhoto({ source: imageStream });
	}
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));