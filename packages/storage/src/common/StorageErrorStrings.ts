// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export enum StorageErrorStrings {
	NO_CREDENTIALS = 'No credentials',
	NO_SRC_KEY = 'source param should be an object with the property "key" with value of type string',
	NO_DEST_KEY = 'destination param should be an object with the property "key" with value of type string',
	INVALID_BLOB = 'Object must be an instance of Blob',
}

export enum AWSS3ProviderMultipartCopierErrors {
	CLEANUP_FAILED = 'Multipart copy clean up failed',
	NO_OBJECT_FOUND = 'Object does not exist',
	INVALID_QUEUESIZE = 'Queue size must be a positive number',
	NO_COPYSOURCE = 'You must specify a copy source',
	MAX_NUM_PARTS_EXCEEDED = 'Only a maximum of 10000 parts are allowed',
}

export enum AWSS3ProviderUploadErrorStrings {
	UPLOAD_PAUSED_MESSAGE = 'paused',
}
