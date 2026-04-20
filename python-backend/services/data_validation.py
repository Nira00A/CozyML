import pandas as pd
import numpy as np
from dto.process import DataProcessingDTO

def validate_model_compatibility(X_train: pd.DataFrame, y_train: pd.DataFrame, model_name: str , config: DataProcessingDTO):
    # -------------------------------------
    #    Model Compatibility Validation
    # -------------------------------------

    # Determining if the target is continuous or categorical
    is_numerical_target = pd.api.types.is_numeric_dtype(y_train)
    unique_classes = len(np.unique(y_train))
    is_y_continuous = is_numerical_target and unique_classes > 25

    # Define model compatibility rules
    classification_models = ["logistic_regression", "svm", "ann", "cnn"]
    regression_models = ["linear_regression"]

    if model_name in classification_models and is_y_continuous:
        raise ValueError(f"Model '{model_name}' is a classification model but the target variable appears to be continuous.")
    if model_name in regression_models and not is_y_continuous:
        raise ValueError(f"Model '{model_name}' is a regression model but the target variable appears to be categorical.")
    
    ## for Scaling Compatibility
    if model_name in ["ann", "cnn" , "knn"] and config.feature_scaling_strategy == None:
        raise ValueError(f"Model '{model_name}' typically requires feature scaling. Please select a feature scaling strategy in your configuration.")
    
    ## Check for shape compatibility for ANN/CNN
    if model_name in ["cnn"]:
        if len(X_train.shape) != 3:
            raise ValueError(f"Model '{model_name}' expects 3D input data (samples, timesteps, features). Please reshape your data accordingly.")

    return True