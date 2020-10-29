from setuptools import setup, find_packages


setup(
    name='tourney_site',
    version='0.0.1',
    description='',
    author='Various',
    url='https://github.com/LogicalInnovation/tourney-site-test-template-v2',
    install_requires=[
        'flask',
        'pymongo',
        'bcrypt',
        'werkzeug',
        'click'
    ],
    packages=find_packages(),
    package_data={
    },
)