import { auth, db } from "@/firebase.config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, sendEmailVerification } from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

const register = async (name, email, password, setOpen, setErrorMessage) => {
	try {
		const usersRef = collection(db, 'users');
		const q = query(usersRef, where('email', '==', email));
		const querySnapshot = await getDocs(q);
		if (!querySnapshot.empty) {
			throw new Error('Email already exists, please login!');
		}
		const res = await createUserWithEmailAndPassword(auth, email, password);
		const user = res.user;

		console.log(user);

		await addDoc(collection(db, "users"), {
			name: name,
			email: email,
			uid: user.uid,
			createdOn: new Date(),
		});

		await updateProfile(user, {
			displayName: name,
			photoURL: "https://healthcaredesignmagazine.com/wp-content/uploads/2017/03/EwingCole-Entrance_Page_01_620x380.jpg",
		});
	} catch (error) {
		console.error(error);
		setErrorMessage(error.message);
		setOpen(true);
	}
};

const login = async (email, password, setOpen, setErrorMessage) => {
	try {
		const usersRef = collection(db, 'users');
		const q = query(usersRef, where('email', '==', email));
		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			throw new Error('Email not found, please register!');
		}

		const res = await signInWithEmailAndPassword(auth, email, password);
		const user = res.user;

		console.log(user);
	} catch (error) {
		console.log(error);
		setErrorMessage(error.message);
		setOpen(true);
	}
};

const logout = async (setOpen, setErrorMessage) => {
	try {
		signOut(auth);
	} catch (error) {
		console.log(error);
		setErrorMessage(error.message);
		setOpen(true);
	}
};

const verify = async (setOpen, setErrorMessage) => {
	try {
		const sendEmail = await sendEmailVerification(auth.currentUser);
		console.log(sendEmail, auth);
	} catch (error) {
		console.log(error);
		setErrorMessage(error.message);
		setOpen(true);
	};
};

export { register, login, logout, verify };