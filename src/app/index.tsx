import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';

const HomeScreen = () => {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            gender: '',
            age: '',
            hypertension: '',
            heart_disease: '',
            smoking_history: '',
            weight: '',
            height: '',
            HbA1c_level: '',
            blood_glucose_level: '',
        },
    });
    const [message, setMessage] = useState<string | null>(null);

    const onSubmit = async (data: any) => {
        try {
            const weight = parseFloat(data.weight);
            const height = parseFloat(data.height);
            const bmi = weight / (height * height);

            const requestData = {
                gender: data.gender,
                age: parseFloat(data.age),
                hypertension: parseInt(data.hypertension),
                heart_disease: parseInt(data.heart_disease),
                smoking_history: data.smoking_history,
                bmi: bmi,
                HbA1c_level: parseFloat(data.HbA1c_level),
                blood_glucose_level: parseInt(data.blood_glucose_level),
            };

            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const responseData = await response.json();
                setMessage(responseData.message);
            } else {
                console.error('Erro ao enviar dados:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Predição de Diabetes</Text>

            {/* Gênero */}
            <Text>Gênero</Text>
            <Controller
                control={control}
                render={({ field }) => (
                    <Picker
                        selectedValue={field.value}
                        onValueChange={field.onChange}
                        style={styles.input}
                    >
                        <Picker.Item label="Selecione" value="" />
                        <Picker.Item label="Masculino" value="Male" />
                        <Picker.Item label="Feminino" value="Female" />
                    </Picker>
                )}
                name="gender"
                rules={{ required: true }}
            />
            {errors.gender && <Text style={styles.error}>Este campo é obrigatório.</Text>}

            {/* Idade */}
            <Text>Idade</Text>
            <Controller
                control={control}
                render={({ field }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Idade"
                        onChangeText={field.onChange}
                        value={field.value}
                        keyboardType="numeric"
                        inputMode="numeric"
                    />
                )}
                name="age"
                rules={{ required: true, pattern: /^[0-9]+([,.][0-9]+)?$/ }}
            />
            {errors.age && <Text style={styles.error}>Este campo é obrigatório e deve ser numérico.</Text>}

            {/* Hipertensão */}
            <Text>Hipertensão</Text>
            <Controller
                control={control}
                render={({ field }) => (
                    <Picker
                        selectedValue={field.value}
                        onValueChange={field.onChange}
                        style={styles.input}
                    >
                        <Picker.Item label="Selecione" value="" />
                        <Picker.Item label="Não" value="0" />
                        <Picker.Item label="Sim" value="1" />
                    </Picker>
                )}
                name="hypertension"
                rules={{ required: true }}
            />
            {errors.hypertension && <Text style={styles.error}>Este campo é obrigatório.</Text>}

            {/* Doença Cardíaca */}
            <Text>Doença Cardíaca</Text>
            <Controller
                control={control}
                render={({ field }) => (
                    <Picker
                        selectedValue={field.value}
                        onValueChange={field.onChange}
                        style={styles.input}
                    >
                        <Picker.Item label="Selecione" value="" />
                        <Picker.Item label="Não" value="0" />
                        <Picker.Item label="Sim" value="1" />
                    </Picker>
                )}
                name="heart_disease"
                rules={{ required: true }}
            />
            {errors.heart_disease && <Text style={styles.error}>Este campo é obrigatório.</Text>}

            {/* Histórico de Fumo */}
            <Text>Histórico de Fumo</Text>
            <Controller
                control={control}
                render={({ field }) => (
                    <Picker
                        selectedValue={field.value}
                        onValueChange={field.onChange}
                        style={styles.input}
                    >
                        <Picker.Item label="Selecione" value="" />
                        <Picker.Item label="Nunca" value="never" />
                        <Picker.Item label="Atualmente" value="current" />
                        <Picker.Item label="Ex-Fumante" value="ex" />
                        <Picker.Item label="Ocasional" value="occasional" />
                        <Picker.Item label="Não Informado" value="No Info" />
                    </Picker>
                )}
                name="smoking_history"
                rules={{ required: true }}
            />
            {errors.smoking_history && <Text style={styles.error}>Este campo é obrigatório.</Text>}

            {/* Peso */}
            <Text>Peso (kg)</Text>
            <Controller
                control={control}
                render={({ field }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Peso"
                        onChangeText={field.onChange}
                        value={field.value}
                        keyboardType="numeric"
                        inputMode="numeric"
                    />
                )}
                name="weight"
                rules={{ required: true, pattern: /^[0-9]+([,.][0-9]+)?$/ }}
            />
            {errors.weight && <Text style={styles.error}>Este campo é obrigatório e deve ser numérico.</Text>}

            {/* Altura */}
            <Text>Altura (m)</Text>
            <Controller
                control={control}
                render={({ field }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Altura"
                        onChangeText={field.onChange}
                        value={field.value}
                        keyboardType="numeric"
                        inputMode="numeric"
                    />
                )}
                name="height"
                rules={{ required: true, pattern: /^[0-9]+([,.][0-9]+)?$/ }}
            />
            {errors.height && <Text style={styles.error}>Este campo é obrigatório e deve ser numérico.</Text>}

            {/* Nível de HbA1c */}
            <Text>Nível de HbA1c</Text>
            <Controller
                control={control}
                render={({ field }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="HbA1c"
                        onChangeText={field.onChange}
                        value={field.value}
                        keyboardType="numeric"
                        inputMode="numeric"
                    />
                )}
                name="HbA1c_level"
                rules={{ required: true, pattern: /^[0-9]+([,.][0-9]+)?$/ }}
            />
            {errors.HbA1c_level && <Text style={styles.error}>Este campo é obrigatório e deve ser numérico.</Text>}

            {/* Nível de Glicose no Sangue */}
            <Text>Nível de Glicose no Sangue</Text>
            <Controller
                control={control}
                render={({ field }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Nível de Glicose"
                        onChangeText={field.onChange}
                        value={field.value}
                        keyboardType="numeric"
                        inputMode="numeric"
                    />
                )}
                name="blood_glucose_level"
                rules={{ required: true, pattern: /^[0-9]+([,.][0-9]+)?$/ }}
            />
            {errors.blood_glucose_level && <Text style={styles.error}>Este campo é obrigatório e deve ser numérico.</Text>}

            <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>Enviar</Text>
            </Pressable>
            {message && (
                <Text style={styles.result}>{message}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 5,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    result: {
        marginTop: 20,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
    error: {
        color: 'red',
        fontSize: 14,
        marginBottom: 5,
    },
});

export default HomeScreen;
