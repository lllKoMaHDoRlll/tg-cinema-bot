

export const SUBSCRIBED_CONGRATULATION = () => "Поздравляю, ты подписан на все каналы!";

export const NOT_SUBSCRIBED_ALERT = () => "Упс, ты подписан не на все каналы. Подпишись на них, чтобы получить доступ к фильмам.";

export const NOT_ADMIN_ALERT = () => "Вы не админ!";

export const REQUEST_MOVIE_NAME = () => "Укажите название фильма!";

export const ADD_MOVIE_SUCCESS = (movieName: string, movieId: number) => `
Фильм "${movieName}" был успешно добавлен.

Его id: ${movieId}.
`;

export const REQUEST_MOVIE_ID = () => "Укажите номер фильма!";

export const NO_MOVIE_FOUND_WITH_ID = () => "Фильм с указанным номером не найден, проверьте правильность номера.";

export const MOVIE_DESCRIPTION = (name: string, alternativeName: string, year: number, shortDescription: string, externalId: number) => `
Название: ${name}
Оригинальное название: ${alternativeName}
Год: ${year}
Описание: ${shortDescription}
Id на кинопоиске: ${externalId}
`;

export const USER_COMMANDS_LIST = () => `
Вот список доступных команд: 

1. /start - Проверить подписку на каналы.
2. /get номер_фильма - Получить фильм по его номеру.
3. /help - Список комманд.
`;

export const ADMINS_COMMANDS_LIST = () => `
Команды, доступные для админов:

1. /add название_фильма - добавить фильм и получить его номер.
`;

export const DB_EXEC_ERROR = () => `
Упс... Произошла ошибка при обращении к базе данных.

Мы уже стараемся это исправить.
`;

