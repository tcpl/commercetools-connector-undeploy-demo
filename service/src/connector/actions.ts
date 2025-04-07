import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { ExtensionDestination } from '@commercetools/platform-sdk';
import { getLogger } from '../utils/logger.utils';

const CART_EXTENSION_KEY = 'tcpl-extension-test';

export async function createCartUpdateExtension(
  apiRoot: ByProjectKeyRequestBuilder,
  applicationUrl: string
): Promise<void> {
  const logger = getLogger(false);
  const extension = await getExtension(apiRoot);

  const destination: ExtensionDestination = {
    type: 'HTTP',
    url: applicationUrl,
  };

  if (!extension) {
    logger.info('Creating cart extension...');
    await apiRoot
      .extensions()
      .post({
        body: {
          key: CART_EXTENSION_KEY,
          destination: destination,
          triggers: [
            {
              resourceTypeId: 'cart',
              actions: ['Create', 'Update'],
            },
            {
              resourceTypeId: 'order',
              actions: ['Create'],
            },
          ],
        },
      })
      .execute();
  } else {
    logger.info('Updating cart extension...');
    await apiRoot
      .extensions()
      .withKey({ key: CART_EXTENSION_KEY })
      .post({
        body: {
          version: extension.version,
          actions: [
            {
              action: 'changeDestination',
              destination: destination,
            },
          ],
        },
      })
      .execute();
  }
}

export async function deleteCartUpdateExtension(
  apiRoot: ByProjectKeyRequestBuilder
): Promise<void> {
  getLogger(false).info('Deleting cart extension...');
  const extension = await getExtension(apiRoot);

  if (extension) {
    await apiRoot
      .extensions()
      .withKey({ key: CART_EXTENSION_KEY })
      .delete({
        queryArgs: {
          version: extension.version,
        },
      })
      .execute();
  }
}

async function getExtension(apiRoot: ByProjectKeyRequestBuilder) {
  const {
    body: { results: extensions },
  } = await apiRoot
    .extensions()
    .get({
      queryArgs: {
        where: `key = "${CART_EXTENSION_KEY}"`,
      },
    })
    .execute();

  return extensions.length === 0 ? undefined : extensions[0];
}
