
const storage = {
	get: key => {
        if (Boolean(
            typeof window !== "undefined" &&
              window.document &&
              window.document.createElement
          )) {
              return (localStorage.getItem(key)) || null;
          }
	},

	set: (key, value) => {
		if (!value || value.length <= 0) {
			return;
		}
		if (Boolean(
            typeof window !== "undefined" &&
              window.document &&
              window.document.createElement
          )) {
			window.localStorage.setItem(key, value);
		}
	},

	remove: key => {
		if (window.localStorage && window.localStorage[key]) {
			window.localStorage.removeItem(key);
			return true;
		}
	}
};

export const currentLangCode = storage.get("language") || "ru";

export default storage;
