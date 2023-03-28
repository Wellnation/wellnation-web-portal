import { auth, db } from "@/lib/firebase.config";
import { 
	createUserWithEmailAndPassword, 
	signInWithEmailAndPassword, 
	signOut, 
	updateProfile,
	sendPasswordResetEmail,
	confirmPasswordReset
} from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

const register = async (name, email, password, setOpen, setErrorMessage, setType) => {
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

		window.location.href = "/";
	} catch (error) {
		console.error(error);
		setType("error");
		setErrorMessage(error.message);
		setOpen(true);
	}
};

const login = async (email, password, setOpen, setErrorMessage, setType) => {
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
		window.location.href="/";
	} catch (error) {
		console.log(error);
		setType("error");
		setErrorMessage(error.message);
		setOpen(true);
	}
};

const logout = async (setOpen, setErrorMessage, setType) => {
	try {
		signOut(auth);
		window.location.href="/";
	} catch (error) {
		console.log(error);
		setType("error");
		setErrorMessage(error.message);
		setOpen(true);
	}
};

const forgotPassword = async (email, setOpen, setErrorMessage, setType) => {
	try {
		await sendPasswordResetEmail(auth, email);
		console.log(auth);
		setType("success");
		setErrorMessage("Email sent, please check your inbox and follow the instructions to reset your password.");
		setOpen(true);
	} catch (error) {
		console.log(error);
		setType("error");
		setErrorMessage(error.message);
		setOpen(true);
	};
};

const resetPassword = async (code, password, setOpen, setErrorMessage, setType) => {
	try {
		console.log(auth, code);
		await confirmPasswordReset(auth, code, password);
		setType("success");
		setErrorMessage("Password reset successful, please login.");
		setOpen(true);
	} catch (error) {
		console.log(error);
		setType("error");
		setErrorMessage(error.message);
		setOpen(true);
	};
};

export { register, login, logout, forgotPassword, resetPassword };