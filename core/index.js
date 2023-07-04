import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.TOKEN);

// Создаем объект для хранения информации о пользователе
const user = {
	route: null,
	hints: false,
};

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
	user.route = 'route1';
});

bot.action('route2', async (ctx) => {
	await ctx.reply(
		'Вы выбрали маршрут 2\nНапишите "Подсказка" в чат, чтобы получить подсказку'
	);
	user.route = 'route2';
});
const bunkerRegex = /бункер(-42| 42|)/i;
const museumRegex = /музей( кулинарного искусства|)/i;

bot.hears('Подсказка', async (ctx) => {
	if (user.route === 'route1') {
		const buttons = Markup.inlineKeyboard([
			Markup.button.callback('Точка №4', 'point4'),
			Markup.button.callback('Точка №5', 'point5'),
			Markup.button.callback('Точка №7', 'point7'),
			Markup.button.callback('Точка №10', 'point10'),
		]);
		await ctx.reply('Выберите точку:', buttons);
		bot.action('point4', async (ctx) => {
			await ctx.reply('5-й Котельнический переулок, 11');
		});
		bot.action('point5', async (ctx) => {
			await ctx.reply('Котельническая набережная, 1/15');
		});
		bot.action('point7', async (ctx) => {
			await ctx.reply('Верхняя Радищенская улица, 11');
		});
		bot.action('point10', async (ctx) => {
			await ctx.reply('Таганская улица, 40-42');
		});
		bot.hears(bunkerRegex, async (ctx) => {
			await ctx.reply('C');
		});
		bot.hears('Подсказка', async (ctx) => {
			await ctx.sendPhoto('bunker.jpg');
		})
		bot.hears('музей кулинарного искусства' || 'музей', async (ctx) => {
			await ctx.reply('У')
		});
		bot.hears('Подсказка', async (ctx) => {
			await ctx.reply('Детский таганский парк');
		})
	} else if (user.route === 'route2') {
		const buttons = Markup.inlineKeyboard([
			Markup.button.callback('Точка №4', 'point4'),
			Markup.button.callback('Точка №6', 'point6'),
			Markup.button.callback('Точка №7', 'point7'),
			Markup.button.callback('Точка №10', 'point10'),
		]);
		await ctx.reply('Выберите точку:', buttons);
		bot.action('point4', async (ctx) => {
			await ctx.reply('Верхняя Радищенская улица, 11');
		});
		bot.action('point6', async (ctx) => {
			await ctx.reply('Котельническая набережная, 1/15');
		});
		bot.action('point7', async (ctx) => {
			await ctx.reply('5-й Котельнический переулок, 11');
		});
		bot.action('point10', async (ctx) => {
			await ctx.reply('Таганская улица, 40-42');
		});
		bot.hears(museumRegex, async (ctx) => {
			await ctx.reply('У')
		});
		bot.hears('Подсказка', async (ctx) => {
			await ctx.reply('Что говорил Шекспир про весь мир?');
		})
		bot.hears('Библиотека', async (ctx) => {
			await ctx.sendPhoto('library.jpg');
		})
		bot.hears(bunkerRegex, async (ctx) => {
			await ctx.reply('C');
		});
		bot.hears('Подсказка', async (ctx) => {
			await ctx.reply('Улица Большие Каменщики, 9сС');
		})
	} else {
		await ctx.reply('Вы не выбрали маршрут');
	}
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
