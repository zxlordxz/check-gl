from setuptools import setup, find_packages
from checkuser import __version__, __author__, __email__

PACKAGES = find_packages()
REQUIREMENTS = open('requirements.txt').read().splitlines()
VERSION = __version__

DESCRIPTION = open('README.md').read()
AUTHOR = __author__
AUTHOR_EMAIL = __email__
URL = 'https://github.com/zxlordxz/check-gl'
LICENSE = 'MIT'

setup(name='check-gl',
      version=VERSION,
      description=DESCRIPTION,
      author=AUTHOR,
      author_email=AUTHOR_EMAIL,
      url=URL,
      license=LICENSE,
      packages=PACKAGES,
      include_package_data=True,
      install_requires=REQUIREMENTS,
      entry_points={
          'console_scripts': [
              'checkuser = checkuser.__main__:main',
          ],
      })
