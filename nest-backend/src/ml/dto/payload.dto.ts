import { z } from 'zod';

// DTO for data processing and model configuration

export const DataProcessingDTOSchema = z.object({
  // Target variable
  target_variable: z.string().nullable().optional().default(null),

  // Data Splitting
  test_size: z.number().nullable().optional().default(0.2),

  // Date feature handling
  date_feature_strategy: z
    .enum(['date_month', 'date_year', 'timestamp', 'drop'])
    .nullable()
    .optional()
    .default(null),

  // Handle missing values
  numerical_missing_strategy: z
    .enum(['mean', 'median', 'most_frequent', 'drop', 'knn_imputer'])
    .nullable()
    .optional()
    .default('mean'),
  categorical_missing_strategy: z
    .enum(['most_frequent', 'constant', 'drop'])
    .nullable()
    .optional()
    .default('drop'),

  // Handling categorical variables
  categorical_encoding_strategy: z
    .enum(['onehot', 'label', 'ordinal'])
    .nullable()
    .optional()
    .default(null),

  // Custom transformations
  custom_transformations: z
    .enum(['log', 'sqrt', 'boxcox'])
    .nullable()
    .optional()
    .default(null),

  // Feature scaling
  feature_scaling_strategy: z
    .enum(['standardization', 'normalization', 'minmax'])
    .nullable()
    .optional()
    .default('standardization'),

  // Outlier handling
  outlier_handling_strategy: z
    .enum(['z_score', 'iqr', 'drop'])
    .nullable()
    .optional()
    .default(null),
});

export type DataProcessingDTO = z.infer<typeof DataProcessingDTOSchema>;

// Model configuration DTOs

// KnnModelDTO, DecisionTreeModelDTO, LinearRegressionModelDTO, LogisticRegressionModelDTO, AnnModelDTO, CnnModelDTO

export const KnnModelDTOSchema = z.object({
  model_name: z.literal('knn'),
  model_type: z.enum(['classification', 'regression']),
  n_neighbors: z.number().int().nullable().optional().default(5),
  weights: z
    .enum(['uniform', 'distance'])
    .nullable()
    .optional()
    .default('uniform'),
});

export type KnnModelDTO = z.infer<typeof KnnModelDTOSchema>;

export const DecisionTreeModelDTOSchema = z.object({
  model_name: z.literal('decision_tree'),
  model_type: z.enum(['classification', 'regression']),
  criterion: z.enum(['gini', 'entropy', 'log_loss']).default('gini'),
  max_depth: z.number().int().nullable().optional().default(null),
  min_samples_split: z.number().int().nullable().optional().default(2),
});

export type DecisionTreeModelDTO = z.infer<typeof DecisionTreeModelDTOSchema>;

export const LinearRegressionModelDTOSchema = z.object({
  model_name: z.literal('linear_regression'),
  model_type: z.literal('regression'),
});

export type LinearRegressionModelDTO = z.infer<
  typeof LinearRegressionModelDTOSchema
>;

export const LogisticRegressionModelDTOSchema = z.object({
  model_name: z.literal('logistic_regression'),
  model_type: z.literal('classification'),
  penalty: z
    .enum(['l1', 'l2', 'elasticnet', 'none'])
    .nullable()
    .optional()
    .default('l2'),
  C: z.number().nullable().optional().default(1.0),
});

export type LogisticRegressionModelDTO = z.infer<
  typeof LogisticRegressionModelDTOSchema
>;

export const AnnModelDTOSchema = z.object({
  model_name: z.literal('ann'),
  model_type: z.enum(['classification', 'regression']),
  hidden_layer_sizes: z
    .array(z.number().int())
    .nullable()
    .optional()
    .default([32, 64, 128]),
  activation: z.enum(['relu', 'tanh']).optional().default('relu'),
  optimizer: z
    .enum(['adam', 'sgd', 'rmsprop'])
    .nullable()
    .optional()
    .default('adam'),
  metrics: z.array(z.string()).nullable().optional().default(['accuracy']),
});

export type AnnModelDTO = z.infer<typeof AnnModelDTOSchema>;

export const CnnModelDTOSchema = z.object({
  model_name: z.literal('cnn'),
  model_type: z.enum(['classification', 'regression']),
  hidden_layer_sizes: z
    .array(z.number().int())
    .nullable()
    .optional()
    .default([32, 64]),
  kernel_size: z.number().int().optional().default(3),
  activation: z.enum(['relu', 'tanh']).optional().default('relu'),
  optimizer: z
    .enum(['adam', 'sgd', 'rmsprop'])
    .nullable()
    .optional()
    .default('adam'),
  metrics: z.array(z.string()).nullable().optional().default(['accuracy']),
});

export type CnnModelDTO = z.infer<typeof CnnModelDTOSchema>;

export const ModelConfigSchema = z.discriminatedUnion('model_name', [
  KnnModelDTOSchema,
  DecisionTreeModelDTOSchema,
  LinearRegressionModelDTOSchema,
  LogisticRegressionModelDTOSchema,
  AnnModelDTOSchema,
  CnnModelDTOSchema,
]);

export type ModelConfig = z.infer<typeof ModelConfigSchema>;

// Final Pipeline Payload DTO

export const PipelinePayloadDTOSchema = z.object({
  job_name: z.string(),
  dataset_url: z.string(),
  data_processing: DataProcessingDTOSchema,
  ml_model: ModelConfigSchema, // type: ignore
});

export type PipelinePayloadDTO = z.infer<typeof PipelinePayloadDTOSchema>;
