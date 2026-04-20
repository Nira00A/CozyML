import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler , Normalizer , OneHotEncoder , LabelEncoder , OrdinalEncoder
from sklearn.impute import KNNImputer , SimpleImputer
from sklearn.model_selection import train_test_split
from dto.process import DataProcessingDTO

def data_processing_pipeline(df: pd.DataFrame , config: DataProcessingDTO) -> tuple:
    ## Train test split
    X = df.drop(columns=[config.target_variable])
    y = df[config.target_variable]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=config.test_size, random_state=42)

    ## Handle missing values

    ### Numerical missing values
    try:
        numerical_cols = X_train.select_dtypes(include=['float64', 'int64']).columns

        if len(numerical_cols) > 0:
            if config.numerical_missing_strategy == None:
                pass
            elif config.numerical_missing_strategy == "drop":
                X_train = X_train.drop(columns=numerical_cols)
                X_test = X_test.drop(columns=numerical_cols)
            elif config.numerical_missing_strategy == "knn_imputer":
                imputer = KNNImputer()
                X_train[numerical_cols] = imputer.fit_transform(X_train[numerical_cols])
                X_test[numerical_cols] = imputer.transform(X_test[numerical_cols])
            elif config.numerical_missing_strategy in ["mean", "median", "most_frequent"]:
                imputer = SimpleImputer(strategy=config.numerical_missing_strategy)
                X_train[numerical_cols] = imputer.fit_transform(X_train[numerical_cols])
                X_test[numerical_cols] = imputer.transform(X_test[numerical_cols])
    except Exception as e:
        raise ValueError(f"Error in handling numerical missing values: {str(e)}")

    ### Categorical missing values
    try:
        categorical_cols = X_train.select_dtypes(include=['object']).columns

        if len(categorical_cols) > 0:
            if config.categorical_missing_strategy == None:
                    pass
            elif config.categorical_missing_strategy == "constant":
                imputer_cat = SimpleImputer(strategy='constant', fill_value='missing')
                X_train[categorical_cols] = imputer_cat.fit_transform(X_train[categorical_cols])
                X_test[categorical_cols] = imputer_cat.transform(X_test[categorical_cols])
            elif config.categorical_missing_strategy == "drop":
                X_train = X_train.drop(columns=categorical_cols)
                X_test = X_test.drop(columns=categorical_cols)
            elif config.categorical_missing_strategy in ["most_frequent", "drop"]:
                imputer_cat = SimpleImputer(strategy=config.categorical_missing_strategy)
                X_train[categorical_cols] = imputer_cat.fit_transform(X_train[categorical_cols])
                X_test[categorical_cols] = imputer_cat.transform(X_test[categorical_cols])
    except Exception as e:
        raise ValueError(f"Error in handling categorical missing values: {str(e)}")
        
    ## Custom transformations
    try:
        if config.custom_transformations:
            if config.custom_transformations == "log":
                X_train[numerical_cols] = X_train[numerical_cols].apply(lambda x: np.log1p(x))
                X_test[numerical_cols] = X_test[numerical_cols].apply(lambda x: np.log1p(x))
            elif config.custom_transformations == "sqrt":
                X_train[numerical_cols] = X_train[numerical_cols].apply(lambda x: np.sqrt(x))
                X_test[numerical_cols] = X_test[numerical_cols].apply(lambda x: np.sqrt(x))
            elif config.custom_transformations == "boxcox":
                from scipy import stats
                for col in numerical_cols:
                    X_train[col] = stats.boxcox(X_train[col] + 1) 
                    X_test[col] = stats.boxcox(X_test[col] + 1)
    except Exception as e:
        raise ValueError(f"Error in applying custom transformations: {str(e)}")

    ## Handling categorical variables
    try:
        categorical_cols = X_train.select_dtypes(include=['object']).columns
        if len(categorical_cols) > 0 and config.categorical_encoding_strategy:
            if config.categorical_encoding_strategy == "onehot":
                encoder = OneHotEncoder(sparse=False, handle_unknown='ignore')
                X_train_encoded = np.asarray(encoder.fit_transform(X_train[categorical_cols]))
                X_test_encoded = np.asarray(encoder.transform(X_test[categorical_cols]))
                X_train = np.hstack((X_train.drop(columns=categorical_cols).values, X_train_encoded))
                X_test = np.hstack((X_test.drop(columns=categorical_cols).values, X_test_encoded))
            elif config.categorical_encoding_strategy == "label":
                encoder = LabelEncoder()
                for col in categorical_cols:
                    X_train[col] = encoder.fit_transform(X_train[col])
                    X_test[col] = encoder.transform(X_test[col])
            elif config.categorical_encoding_strategy == "ordinal":
                encoder = OrdinalEncoder()
                X_train[categorical_cols] = np.asarray(encoder.fit_transform(X_train[categorical_cols]))
                X_test[categorical_cols] = np.asarray(encoder.transform(X_test[categorical_cols]))
    except Exception as e:
        raise ValueError(f"Error in handling categorical variables: {str(e)}")

    ## Feature scaling
    if config.feature_scaling_strategy == "standardization":
        scaler = StandardScaler()
        X_train = scaler.fit_transform(X_train)
        X_test = scaler.transform(X_test)
    elif config.feature_scaling_strategy == "minmax":
        scaler = MinMaxScaler()
        X_train = scaler.fit_transform(X_train)
        X_test = scaler.transform(X_test)
    elif config.feature_scaling_strategy == "normalization":
        scaler = Normalizer()
        X_train = scaler.fit_transform(X_train)
        X_test = scaler.transform(X_test)

    ## Outlier handling
    # try:
    #     if config.outlier_handling_strategy in ["z_score", "drop"]:
    #         if config.outlier_handling_strategy == "z_score":
    #             from scipy import stats
    #             z_scores = np.abs(X_train - X_train.mean()) / X_train.std()
    #             X_train = X_train[(z_scores < 3).all(axis=1)]
    #             y_train = y_train[(z_scores < 3).all(axis=1)]
    #         elif config.outlier_handling_strategy == "iqr":
    #             Q1 = np.quantile(X_train, 0.25)
    #             Q3 = np.quantile(X_train, 0.75)
    #             IQR = Q3 - Q1
    #             X_train = X_train[~((X_train < (Q1 - 1.5 * IQR)) | (X_train > (Q3 + 1.5 * IQR))).any(axis=1)]
    #             y_train = y_train[~((X_train < (Q1 - 1.5 * IQR)) | (X_train > (Q3 + 1.5 * IQR))).any(axis=1)]
    #         elif config.outlier_handling_strategy == "drop":
    #             from scipy import stats
    #             z_scores = np.abs(X_train - X_train.mean()) / X_train.std()
    #             X_train = X_train[(z_scores < 3).all(axis=1)]
    #             y_train = y_train[(z_scores < 3).all(axis=1)]
    # except Exception as e:
    #     raise ValueError(f"Error in handling outliers: {str(e)}")

    return (X_train, X_test, y_train, y_test)