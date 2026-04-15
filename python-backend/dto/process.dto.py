from typing import List, Optional , Union , Literal , Annotated 
from pydantic import BaseModel, Field

# DTO for data processing and model configuration

class DataProcessingDTO(BaseModel):
    # Target variable  
    target_variable: Optional[str] = None

    # Data Splitting
    test_size: Optional[float] = 0.2

    # Date feature handling
    date_feature_strategy: Optional[Literal['date_month' , 'date_year', 'timestamp', 'drop']] = None

    # Handle missing values
    numberical_missing_strategy: Optional[Literal['mean', 'median', 'most_frequent', 'drop' , 'knn_imputer']] = 'mean'
    categorical_missing_strategy: Optional[Literal['most_frequent', 'constant' , 'drop']] = 'drop'

    # Handling categorical variables
    categorical_encoding_strategy: Optional[Literal['onehot', 'label', 'ordinal']] = None

    # Custom transformations
    custom_transformations: Optional[Literal['log', 'sqrt', 'boxcox']] = None

    # Feature scaling
    feature_scaling_strategy: Optional[Literal['standardization', 'normalization', 'minmax']] = 'standardization'

    # Outlier handling
    outlier_handling_strategy: Optional[Literal['z_score', 'iqr', 'drop']] = None

# Model configuration DTOs

# KnnModelDTO, DecisionTreeModelDTO, LinearRegressionModelDTO, LogisticRegressionModelDTO, AnnModelDTO, CnnModelDTO

class KnnModelDTO(BaseModel):
    model_name: Literal['knn']
    model_type: Literal['classification', 'regression']
    n_neighbors: Optional[int] = 5
    weights: Optional[Literal['uniform', 'distance']] = 'uniform'

class DecisionTreeModelDTO(BaseModel):
    model_name: Literal['decision_tree']
    model_type: Literal['classification', 'regression']
    criterion: Literal['gini', 'entropy', 'log_loss'] = "gini"
    max_depth: Optional[int] = None
    min_samples_split: Optional[int] = 2

class LinearRegressionModelDTO(BaseModel):
    model_name: Literal['linear_regression']
    model_type: Literal['regression']

class LogisticRegressionModelDTO(BaseModel):
    model_name: Literal['logistic_regression']
    model_type: Literal['classification']
    penalty: Optional[Literal['l1', 'l2', 'elasticnet', 'none']] = 'l2'
    C: Optional[float] = 1.0

class AnnModelDTO(BaseModel):
    model_name: Literal['ann']
    model_type: Literal['classification', 'regression']
    hidden_layer_sizes: Optional[List[int]] = Field(default=[32 , 64 , 128])
    activation: Optional[Literal['relu', 'tanh']] = 'relu'
    solver: Optional[Literal['adam', 'sgd', 'lbfgs']] = 'adam'

class CnnModelDTO(BaseModel):
    model_name: Literal['cnn']
    model_type: Literal['classification', 'regression']
    num_filters: Optional[List[int]] = Field(default=[32, 64])
    kernel_size: Optional[int] = 3
    activation: Optional[Literal['relu', 'tanh']] = 'relu'
    optimizer: Optional[Literal['adam', 'sgd', 'rmsprop']] = 'adam'
    metrics: Optional[List[str]] = Field(default=['accuracy'])


ModelConfig = Annotated[Union[KnnModelDTO, DecisionTreeModelDTO, LinearRegressionModelDTO, LogisticRegressionModelDTO, AnnModelDTO, CnnModelDTO], Field(discriminator='model_name')]

# Final Pipeline Payload DTO

class PipelinePayloadDTO(BaseModel):
    job_name: str
    dataset_url: str
    data_processing: DataProcessingDTO
    model_config: ModelConfig # type: ignore