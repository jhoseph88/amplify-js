// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
	Endpoint,
	HttpRequest,
	HttpResponse,
	parseMetadata,
} from '@aws-amplify/core/internals/aws-client-utils';
import { composeServiceApi } from '@aws-amplify/core/internals/aws-client-utils/composers';

import { defaultConfig } from './base';
import type { PutObjectCommandInput, PutObjectCommandOutput } from './types';
import {
	map,
	parseXmlError,
	s3TransferHandler,
	serializeObjectConfigsToHeaders,
	serializePathnameObjectKey,
} from './utils';
import type { S3ProviderPutConfig } from '../../types';

/**
 * Reference: {@link S3ProviderPutConfig}
 */
export type PutObjectInput = Pick<
	PutObjectCommandInput,
	| 'Bucket'
	| 'Key'
	| 'Body'
	| 'ServerSideEncryption'
	| 'SSECustomerAlgorithm'
	| 'SSECustomerKey'
	| 'SSECustomerKeyMD5'
	| 'SSEKMSKeyId'
	| 'ACL'
	| 'CacheControl'
	| 'ContentDisposition'
	| 'ContentEncoding'
	| 'ContentType'
	| 'Expires'
	| 'Metadata'
	| 'Tagging'
>;

export type PutObjectOutput = Pick<
	PutObjectCommandOutput,
	// PutObject output is not exposed in public API, but only logged in the debug mode
	// so we only expose $metadata, ETag and VersionId for debug purpose.
	'$metadata' | 'ETag' | 'VersionId'
>;

const putObjectSerializer = (
	input: PutObjectInput,
	endpoint: Endpoint
): HttpRequest => {
	const headers = serializeObjectConfigsToHeaders({
		...input,
		ContentType: input.ContentType ?? 'application/octet-stream',
	});
	const url = new URL(endpoint.url.toString());
	url.pathname = serializePathnameObjectKey(url, input.Key);
	return {
		method: 'PUT',
		headers,
		url,
		body: input.Body,
	};
};

const putObjectDeserializer = async (
	response: HttpResponse
): Promise<PutObjectOutput> => {
	if (response.statusCode >= 300) {
		const error = await parseXmlError(response);
		throw error;
	} else {
		return {
			...map(response.headers, {
				ETag: 'etag',
				VersionId: 'x-amz-version-id',
			}),
			$metadata: parseMetadata(response),
		};
	}
};

export const putObject = composeServiceApi(
	s3TransferHandler,
	putObjectSerializer,
	putObjectDeserializer,
	{ ...defaultConfig, responseType: 'text' }
);
