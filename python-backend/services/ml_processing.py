from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from dto.process import ModelConfig
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv1D, MaxPooling1D , Flatten , Input
import pandas as pd

def build_model(config: ModelConfig , X_train: pd.DataFrame):
    model = None

    # ===========================================
    #           Machine Learning Models
    # ===========================================
    
    ### Knn model
    if config.model_name == "knn":
        if config.model_type == "classification":
            model = KNeighborsClassifier(n_neighbors=config.n_neighbors, weights=config.weights)
        # else:
        #     model = KNeighborsRegressor(n_neighbors=config.n_neighbors, weights=config.weights)
    
    ### Decision Tree model
    elif config.model_name == "decision_tree":
        if config.model_type == "classification":
            model = DecisionTreeClassifier(criterion=config.criterion, max_depth=config.max_depth, min_samples_split=config.min_samples_split)
        # else:
        #     model = DecisionTreeRegressor(criterion=config.criterion, max_depth=config.max_depth, min_samples_split=config.min_samples_split)

    ### Linear Regression model
    elif config.model_name == "linear_regression":
        model = LinearRegression()

    ### Logistic Regression model
    elif config.model_name == "logistic_regression":
        if config.penalty == "none":
            model = LogisticRegression(C=config.C)
        else:
            model = LogisticRegression(penalty=config.penalty, C=config.C)

    # ===========================================
    #           Deep Learning Models
    # ===========================================

    ## ANN model
    elif config.model_name == "ann":
        layers = []
        for size in config.hidden_layer_sizes:
            layers.append(Dense(size, activation=config.activation))
        layers.append(Dense(1, activation='sigmoid' if config.model_type == "classification" else 'linear'))
        model = Sequential([
            Input(shape=(X_train.shape[1],)),
            *layers,
        ])

        model.compile(
            optimizer=config.optimizer, 
            loss='binary_crossentropy' if config.model_type == "classification" else 'mean_squared_error', 
            metrics=config.metrics
        )

    ## CNN model
    elif config.model_name == "cnn":
        layers = []
        layers.append(Input(shape=(X_train.shape[1], 1)),)
        for size in config.hidden_layer_sizes:
            layers.append(Conv1D(size, kernel_size=config.kernel_size, activation=config.activation))
            layers.append(MaxPooling1D(pool_size=(2, 2)))
        layers.append(Flatten())
        layers.append(Dense(1, activation='sigmoid' if config.model_type == "classification" else 'linear'))
        model = Sequential([
            *layers,
        ])

        model.compile(
            optimizer=config.optimizer, 
            loss='binary_crossentropy' if config.model_type == "classification" else 'mean_squared_error', 
            metrics=config.metrics
        )

    else:
        raise ValueError("Unsupported model type")
    
    if model is None:
        raise ValueError(f"Model {config.model_name} could not be created with the given configuration or not in the scope of current implementation.")

    return model

    